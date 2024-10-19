import { useMutation, useQueryClient, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { formatDateToLocal } from './useFetchUserData';
import {UserData} from "../types.ts";


const mapFrontendToApiData = (data: UserData) => {
    return {
        date: formatDateToLocal(data.date),
        sleep_cycle_score: data.sleepCycleScore,
        feeling: data.feeling,
    };
};

const saveUserData = async (name: string, data: UserData, isUpdate: boolean) => {
    const method = isUpdate ? 'PUT' : 'POST';

    const formattedData = mapFrontendToApiData(data);  // Map Daten für die API

    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user-data/${name}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
    });

    if (!response.ok) {
        throw new Error('Fehler beim Speichern der Daten');
    }

    return response.json();
};

export const useSaveUserData = (
    name: string,
    isUpdate: boolean,
    options?: UseMutationOptions<UserData, Error, UserData>
): UseMutationResult<UserData, Error, UserData> => {
    const queryClient = useQueryClient();

    return useMutation<UserData, Error, UserData>({
        mutationFn: (data: UserData) => saveUserData(name, data, isUpdate),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['userData', name] });
        },
        ...options,
    });
};
