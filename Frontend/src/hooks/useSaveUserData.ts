import { useMutation, useQueryClient, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { formatDateToLocal } from './useFetchUserData';

interface FormData {
    date: Date;
    sleepCycleScore: number;
    feeling: number;
}

const mapFrontendToApiData = (data: FormData) => {
    return {
        date: formatDateToLocal(data.date),
        sleep_cycle_score: data.sleepCycleScore,
        feeling: data.feeling,
    };
};

const saveUserData = async (name: string, data: FormData, isUpdate: boolean) => {
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
    options?: UseMutationOptions<FormData, Error, FormData>
): UseMutationResult<FormData, Error, FormData> => {
    const queryClient = useQueryClient();

    return useMutation<FormData, Error, FormData>({
        mutationFn: (data: FormData) => saveUserData(name, data, isUpdate),
        onSuccess: () => {
            void queryClient.invalidateQueries({ queryKey: ['userData', name] });
        },
        ...options,
    });
};
