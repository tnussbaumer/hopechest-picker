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

      // ===== RESEND SANDBOX MODE - STRICT COMPLIANCE =====
      // ===== RESEND SANDBOX MODE - STRICT COMPLIANCE =====
      // For production, these should be environment variables (e.g., process.env.INTERNAL_EMAIL_TO)
      const SANDBOX_FROM = 'onboarding@resend.dev'; // Strict sandbox format (no display name)
      const INTERNAL_EMAIL_TO = 'tnussbomber@gmail.com'; // Internal recipient
      // ==================================================

      // User's email from the wizard submission
      const USER_EMAIL_FROM_WIZARD = wizardState.email; 

      // ===== DEBUGGING IN SANDBOX MODE =====
      // In Resend Sandbox Mode, emails can ONLY be sent to verified email addresses.
      // For testing, we'll temporarily send both emails to the INTERNAL_EMAIL_TO.
      // In a production environment with verified domains, USER_EMAIL_FROM_WIZARD would be used directly.
      const ACTUAL_USER_EMAIL_FOR_SANDBOX_TESTING = INTERNAL_EMAIL_TO; 
      // =====================================

      // Check API key exists
      console.log('🔑 Resend API Key:', process.env.RESEND_API_KEY ? 'Key exists ✓' : '❌ MISSING KEY');
      console.log('📧 Email configuration for Internal Alert:');
      console.log('   From:', SANDBOX_FROM);
      console.log('   To (Internal):', INTERNAL_EMAIL_TO);

      // Send internal alert
      console.log('\n📨 Attempting to send Internal Alert email to:', INTERNAL_EMAIL_TO, '...');
      const internalResult = await resend.emails.send({
        from: SANDBOX_FROM,
        to: INTERNAL_EMAIL_TO, // Internal recipient
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
      
      // Check for errors in response
      if (internalResult.error) {
        console.error('❌ Internal Alert Error:', internalResult.error);
        throw new Error(`Internal Alert failed: ${JSON.stringify(internalResult.error)}`);
      }

      // Send pastor confirmation email to the user/pastor's email (or verified sandbox test email)
      console.log('\n📨 Attempting to send Pastor Confirmation email.');
      console.log('   Original User Email from Wizard:', USER_EMAIL_FROM_WIZARD);
      console.log('   Sending to (for Sandbox Testing):', ACTUAL_USER_EMAIL_FOR_SANDBOX_TESTING);

      const pastorResult = await resend.emails.send({
        from: SANDBOX_FROM,
        to: ACTUAL_USER_EMAIL_FOR_SANDBOX_TESTING, // Temporarily using verified email for sandbox testing
        subject: 'Your HopeChest Partnership Guide',
        react: PastorResults({
          contactName: wizardState.contactName,
          topMatches: top3Matches,
        }),
      });

      console.log('✅ Pastor Confirmation Response:', JSON.stringify(pastorResult, null, 2));
      
      // Check for errors in response
      if (pastorResult.error) {
        console.error('❌ Pastor Confirmation Error:', pastorResult.error);
        throw new Error(`Pastor Confirmation failed: ${JSON.stringify(pastorResult.error)}`);
      }

      console.log('\n✨ All emails sent successfully. Internal to:', INTERNAL_EMAIL_TO, ' and User to (for Sandbox Testing):', ACTUAL_USER_EMAIL_FOR_SANDBOX_TESTING);
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
