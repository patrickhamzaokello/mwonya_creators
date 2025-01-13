// app/actions.js
'use server';
import { fetchmonthlyData, fetchArtistTopSongs, getArtistMetrisx,fetchArtistActivities, fetchArtistPaymentDate } from '@/data-layer/dashboard_metrics';


export async function getStatsMetric(artist_id: string): Promise<OverviewData | MessageType> {
  try {
    const data = await getArtistMetrisx(artist_id)
    return data;
  } catch (error) {
    console.error('Error fetching stats metric:', error);
    throw error;
  }
}

export async function getMonthlyStatsAction(artist_id: string, year: string): Promise<MonthlyData[] | MessageType> {
  try {
      const data = await fetchmonthlyData(artist_id, year);
      return data;
  } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
  }
}


  export async function getArtistTopSongs(artist_id: string): Promise<Song[] | MessageType> {
    try {
      const data = await fetchArtistTopSongs(artist_id)
      return data;
    } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
    }
  }

  export async function getArtistPaymentDate(artist_id: string): Promise<PayoutData[] | MessageType> {
    try {
      const data = await fetchArtistPaymentDate(artist_id)
      return data;
    } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
    }
  }

  export async function getArtistActivity(artist_id: string): Promise<Activity[] | MessageType> {
    try {
      const data = await fetchArtistActivities(artist_id)
      return data;
    } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
    }
  }