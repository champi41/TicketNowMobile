import { useState, useEffect } from "react";
import { getEvents } from "../../servicios/api";

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        setError(err.message || "Error desconocido al cargar eventos.");
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, []);

  return { events, loading, error, setEvents };
};