import { WizardState } from '../types/wizard';
import { CountryScore } from '../types/wizard';

/**
 * Save fit guide to Supabase database and send email notifications
 */
export async function saveFitGuide(
  wizardState: WizardState,
  results: CountryScore[],
  allScores: Record<string, number>,
  confidence: 'high' | 'medium' | 'low'
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/save-fit-guide', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wizardState,
        results,
        allScores,
        confidence,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      console.error('API error:', data.error);
      return { success: false, error: data.error || 'Failed to save' };
    }

    console.log('Fit guide saved and emails sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving fit guide:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
