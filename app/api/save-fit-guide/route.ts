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
      mobilization_other: wizardState.mobilizationOther || null,
      
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

      // Email configuration from environment variables
      const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@missionvox.ai';
      const INTERNAL_EMAIL_TO = process.env.INTERNAL_EMAIL_TO || 'tim@missionvox.ai';
      const pastorEmail = wizardState.email;

      // Logging for debugging
      console.log('🔑 Resend API Key:', process.env.RESEND_API_KEY ? 'Key exists ✓' : '❌ MISSING KEY');
      console.log('📧 Email configuration:');
      console.log('   From:', EMAIL_FROM);
      console.log('   Internal recipient:', INTERNAL_EMAIL_TO);
      console.log('   Pastor/User recipient:', pastorEmail);

      // Send internal alert email
      console.log('\n📨 Sending Internal Alert email to:', INTERNAL_EMAIL_TO);
      const internalResult = await resend.emails.send({
        from: EMAIL_FROM,
        to: INTERNAL_EMAIL_TO,
        subject: `New Vision Trip Lead: ${wizardState.churchName}`,
        react: InternalAlert({
          churchName: wizardState.churchName,
          contactName: wizardState.contactName,
          contactEmail: wizardState.email,
          contactRole: wizardState.contactRole,
          topMatches: top3Matches,
        }),
      });

      console.log('✅ Internal Alert Response:', JSON.stringify(internalResult, null, 2));
      
      if (internalResult.error) {
        console.error('❌ Internal Alert Error:', internalResult.error);
        throw new Error(`Internal Alert failed: ${JSON.stringify(internalResult.error)}`);
      }

      // Send pastor confirmation email
      console.log('\n📨 Sending Pastor Confirmation email to:', pastorEmail);
      const pastorResult = await resend.emails.send({
        from: EMAIL_FROM,
        to: pastorEmail,
        subject: 'Your HopeChest Partnership Guide',
        react: PastorResults({
          contactName: wizardState.contactName,
          topMatches: top3Matches,
        }),
      });

      console.log('✅ Pastor Confirmation Response:', JSON.stringify(pastorResult, null, 2));
      
      if (pastorResult.error) {
        console.error('❌ Pastor Confirmation Error:', pastorResult.error);
        throw new Error(`Pastor Confirmation failed: ${JSON.stringify(pastorResult.error)}`);
      }

      console.log('\n✨ All emails sent successfully!');
      console.log('   Internal alert sent to:', INTERNAL_EMAIL_TO);
      console.log('   Pastor confirmation sent to:', pastorEmail);
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
