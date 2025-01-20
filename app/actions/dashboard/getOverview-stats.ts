// app/actions.js
'use server';
import { fetchmonthlyData, fetchArtistTopSongs, getArtistMetrisx,fetchArtistActivities, fetchArtistPaymentDate, fetchArtistSummaryData } from '@/data-layer/dashboard_metrics';
import { MetricItemProps } from '@/types/artist';


export async function getStatsMetric(artist_id: string, keyMetrics:string[]): Promise<OverviewData[] | MessageType> {
  try {
    const data = await getArtistMetrisx(artist_id,keyMetrics)
    return data;
  } catch (error) {
    console.error('Error fetching stats metric:', error);
    throw error;
  }
}

export async function getMonthlyStatsAction(artist_id: string, months_number: number): Promise<MonthlyData[] | MessageType> {
  try {
      const data = await fetchmonthlyData(artist_id, months_number);
      return data;
  } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
  }
}

export async function getArtistSummaryData(artist_id: string, isVerified: boolean): Promise<MetricItemProps[] | MessageType> {
  try {
    const data = await fetchArtistSummaryData(artist_id, isVerified)
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

  export async function getArtistActivity(artist_id: string): Promise<lastestAlbum | MessageType> {
    try {
      const data = await fetchArtistActivities(artist_id)
      return data;
    } catch (error) {
      console.error('Error fetching stats metric:', error);
      throw error;
    }
  }