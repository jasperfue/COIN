import {useQuery, UseQueryOptions} from '@tanstack/react-query';
import {UserData} from "../types.ts";


export const formatDateToLocal = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const offset = dateObj.getTimezoneOffset();
    const localDate = new Date(dateObj.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
};

const mapApiToFrontendData = (apiData: any): UserData => {
    return {
        date: apiData.date,
        sleepCycleScore: apiData.sleep_cycle_score,
        feeling: apiData.feeling,
    };
};

const fetchUserData = async (name: string, date: Date): Promise<UserData | null> => {
    const formattedDate = formatDateToLocal(date);
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user-data/${name}?date=${formattedDate}`);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error('Fehler beim Laden der Daten');
    }

    const data = await response.json();
    return mapApiToFrontendData(data);
};

export const useFetchUserData = (
    name: string,
    date: Date,
    options?: UseQueryOptions<UserData | null>,
) => {
    return useQuery<UserData | null>({
        queryKey: ['userData', name, formatDateToLocal(date)],
        queryFn: () => fetchUserData(name, date),
        ...options
    });
};
