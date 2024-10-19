import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {formatDateToLocal, useFetchUserData} from './hooks/useFetchUserData';
import { useSaveUserData } from './hooks/useSaveUserData';

const getYesterdayDate = (): Date => {
    const today = new Date();
    today.setDate(today.getDate() - 1);
    return today;
};

const DetailPage = () => {
    const { name } = useParams<{ name: string }>();
    const [selectedDate, setSelectedDate] = useState<Date>(getYesterdayDate());
    const [sleepCycleScore, setSleepCycleScore] = useState<number>(1);
    const [feeling, setFeeling] = useState<number>(1);

    const { data: formData, isError, error } = useFetchUserData(name!, selectedDate);
    const isUpdate = !!formData;

    const { mutate: saveUserData, isLoading: isSaving, isSuccess, error: saveError } = useSaveUserData(name!, isUpdate);

    useEffect(() => {
        if (formData) {
            setSleepCycleScore(formData.sleepCycleScore);
            setFeeling(formData.feeling);
        }
    }, [formData]);

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(new Date(e.target.value));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data = {
            date: formData?.date || selectedDate,
            sleepCycleScore: sleepCycleScore,
            feeling: feeling,
        };

        saveUserData(data);
    };

    if (isSaving) {
        return <div>Speichere Daten...</div>;
    }

    if (isError) {
        return <div>Fehler: {error instanceof Error ? error.message : 'Unbekannter Fehler'}</div>;
    }

    if (saveError) {
        return <div>Fehler beim Speichern: {saveError.message ?? 'Unbekannter Fehler'}</div>;
    }

    return (
        <div>
            <h2>Details für {name}</h2>

            <div className="date-picker-container">
                <label>Datum auswählen: </label>
                <input
                    type="date"
                    value={formatDateToLocal(selectedDate)}
                    onChange={handleDateChange}
                />
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
                <div>
                    <label>Sleep Cycle Score: </label>
                    <input
                        type="number"
                        name="sleepCycleScore"
                        value={sleepCycleScore}
                        onChange={(e) => setSleepCycleScore(Number(e.target.value))}
                        min={1}
                        max={100}
                    />
                </div>
                <div>
                    <label>Eigenes Empfinden: </label>
                    <select
                        name="feeling"
                        value={feeling}
                        onChange={(e) => setFeeling(Number(e.target.value))}
                    >
                        <option value={1}>1 - sehr schlecht</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5 - sehr gut</option>
                    </select>
                </div>
                <button type="submit">
                    {isUpdate ? 'Informationen updaten' : 'Informationen erstellen'}
                </button>
            </form>

            {isSuccess && <p className="confirmation-message">Informationen wurden erfolgreich gespeichert!</p>}
        </div>
    );
};

export default DetailPage;
