import { useState, useEffect, useCallback, useRef } from "react";
import { getEvents } from "../../servicios/api"; 


const PAGE_LIMIT = 20; 

export const useEvents = () => {
    const [events, setEvents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    
    const pageRef = useRef({ currentPage: 1, totalPages: 1 });

    const loadEvents = useCallback(async (pageToFetch) => {
        
        const { totalPages } = pageRef.current;
        
        if (pageToFetch > totalPages && totalPages !== 1) {
            return; 
        }

        if (pageToFetch === 1) setLoading(true);
        else setIsFetchingMore(true);

        setError(null);

        try {
            const result = await getEvents(pageToFetch, PAGE_LIMIT); 

            const totalEvents = result.total || 0; 
            const limitPerPage = PAGE_LIMIT; 
            
            const totalPagesCalculated = Math.ceil(totalEvents / limitPerPage);

            if (pageToFetch === 1) {
                setEvents(result.data);
            } else {
                setEvents(prevEvents => [...prevEvents, ...result.data]);
            }

            pageRef.current = {
                currentPage: pageToFetch,
                totalPages: totalPagesCalculated || 1 
            };
            
        } catch (err) {
            setError(err.message || "Error al cargar eventos.");
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    }, []);

    const fetchNextPage = () => {
        const { currentPage, totalPages } = pageRef.current;
        
        if (!isFetchingMore && currentPage < totalPages) {
            loadEvents(currentPage + 1);
        }
    };

    useEffect(() => {
        loadEvents(1);
    }, [loadEvents]); 

    return { events, loading, error, isFetchingMore, fetchNextPage };
};