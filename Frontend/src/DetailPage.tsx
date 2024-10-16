import {useState, useEffect, FormEvent, ChangeEvent} from 'react';
import { useParams } from 'react-router-dom';

interface FormData {
    date: Date;
    sleepCycleScore: number;
    feeling: number;
}

const userDataPath = '/user-data';

const DetailPage = () => {
    const { name } = useParams<{ name: string }>();
    const [formData, setFormData] = useState<FormData>({
        date: new Date(),
        sleepCycleScore: 1,
        feeling: 1
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Datum als String im Format YYYY-MM-DD

    // API-Call zum Laden der Daten auf Basis des Datums
    const fetchData = async (date: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${userDataPath}/${name}?date=${date}`);
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setFormData({
                        date: data.date ? new Date(data.date) : new Date(),
                        sleepCycleScore: data.sleepCycleScore || 1,
                        feeling: data.feeling || 1,
                    });
                    setIsUpdate(true); // Es gibt bereits Daten, wir updaten
                } else {
                    // Falls keine Daten vorhanden sind, setze die Standardwerte
                    setFormData({
                        date: new Date(date),
                        sleepCycleScore: 1,
                        feeling: 1
                    });
                    setIsUpdate(false);
                }
            }
        } catch (error) {
            console.error('Fehler beim Laden der Daten', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch-Daten bei Erstaufruf basierend auf dem heutigen Datum
    useEffect(() => {
        void fetchData(selectedDate);
    }, [name, selectedDate]);

    // Handling des Date-Pickers außerhalb des Formulars
    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setSelectedDate(newDate); // Aktualisiere das ausgewählte Datum
        void fetchData(newDate); // Lade neue Daten basierend auf dem ausgewählten Datum
    };

    // Handling des Form Inputs für Sleep Cycle Score und Feeling
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: Number(value) // Die Felder als Zahl verarbeiten
        });
    };

    // Form Submission (POST/PUT)
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const requestOptions = {
                method: isUpdate ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    date: formData.date.toISOString() // Date als ISO-String senden
                }),
            };

            const response = await fetch(`${userDataPath}/${name}`, requestOptions);

            if (response.ok) {
                setConfirmationMessage(isUpdate
                    ? 'Informationen wurden erfolgreich aktualisiert!'
                    : 'Informationen wurden erfolgreich erstellt!');
            } else {
                throw new Error('Fehler beim Speichern der Daten');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return <div>Lade Daten...</div>;
    }

    return (
        <div>
            <h2>Details für {name}</h2>

            {/* Datumsauswahl außerhalb des Formulars */}
            <div className="date-picker-container">
                <label>Datum auswählen: </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
                <div>
                    <label>Sleep Cycle Score: </label>
                    <input
                        type="number"
                        name="sleepCycleScore"
                        value={formData.sleepCycleScore}
                        onChange={handleChange}
                        min={1}
                        max={100}
                    />
                </div>
                <div>
                    <label>Eigenes Empfinden: </label>
                    <select
                        name="feeling"
                        value={formData.feeling}
                        onChange={handleChange}
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

            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>
    );
};

export default DetailPage;
