import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabase';
import { resend } from '@/src/lib/resend';
import InternalAlert from '@/src/emails/InternalAlert';
import PastorResults from '@/src/emails/PastorResults';
import { WizardState, CountryScore } from '@/src/types/wizard';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wizardState, results, allScores, confidence } = body as {
      wizardState: WizardState;
      results: CountryScore[];
      allScores: Record<string, number>;
      confidence: 'high' | 'medium' | 'low';
    };

    // Map wizard state to database columns
    const fitGuideData = {
      // Contact & Church Info
      church_name: wizardState.churchName,
      denomination: wizardState.denomination,
      contact_name: wizardState.contactName,
      contact_role: wizardState.contactRole,
      contact_email: wizardState.email,
      
      // Church Size & Global Presence
      attendance_range: wizardState.attendance,
      global_presence_status: wizardState.globalPresenceStatus,
      global_presence_regions: wizardState.existingRegions || null,
      region_preference: wizardState.regionPreference || null,
      
      // Constraints (stored as JSONB)
      sliders: {
        cost: wizardState.costImportance,
        timeAway: wizardState.timeAwayImportance,
        english: wizardState.englishImportance,
      },
      
      // Partnership & Mobilization
      partnership_posture: wizardState.partnershipPosture || null,
      mobilization: wizardState.mobilization || null,
      spanish_toggle: wizardState.spanishToggle || false,
      
      // Impact DNA
      impact_dna: wizardState.impactDNA || null,
      frontier_type: wizardState.frontierType || null,
      other_factors: wizardState.otherFactors || null,
      
      // Scoring Results (stored as JSONB)
      scores: allScores,
      top3: results.map(r => ({
        country: r.country,
        score: r.score,
        reasons: r.reasons,
      })),
      confidence_level: confidence,
    };

    // Save to Supabase
    const { data, error } = await supabase
      .from('fit_guides')
      .insert([fitGuideData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('Fit guide saved successfully:', data);
    
    // Send email notifications (wrapped in try/catch so user still sees success if emails fail)
    try {
      const top3Matches = results.slice(0, 3).map(r => ({
        country: r.country,
        score: r.score,
        reasons: r.reasons,
      }));

      // Internal notification recipients (structured as array for easy expansion)
      const internalRecipients = ['tnussbomber@gmail.com'];

      // Send internal alert to HopeChest team
      await Promise.all(
        internalRecipients.map(recipient =>
          resend.emails.send({
            from: 'HopeChest Partnership Guide <onboarding@resend.dev>',
            to: recipient,
            subject: `New Vision Trip Lead: ${wizardState.churchName}`,
            react: InternalAlert({
              churchName: wizardState.churchName,
              contactName: wizardState.contactName,
              contactEmail: wizardState.email,
              contactRole: wizardState.contactRole,
              topMatches: top3Matches,
            }),
          })
        )
      );

      // Send pastor confirmation email
      await resend.emails.send({
        from: 'HopeChest Partnership Guide <onboarding@resend.dev>',
        to: wizardState.email,
        subject: 'Your HopeChest Partnership Guide',
        react: PastorResults({
          contactName: wizardState.contactName,
          topMatches: top3Matches,
        }),
      });

      console.log('Emails sent successfully');
    } catch (emailError) {
      // Log email error but don't fail the overall operation
      console.error('Error sending emails:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in save-fit-guide API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
