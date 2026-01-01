/**
 * useUser - Custom hook for fetching and managing user data
 */
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types/user';
import { getCurrentUser } from '../api/userApi';

interface UseUserState {
    user: User | null;
    isLoading: boolean;
    error: string | null;
}

interface UseUserReturn extends UseUserState {
    refetch: () => Promise<void>;
}

/**
 * Hook for fetching current user data with loading and error states
 */
export function useUser(): UseUserReturn {
    const [state, setState] = useState<UseUserState>({
        user: null,
        isLoading: true,
        error: null,
    });

    const fetchUser = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const userData = await getCurrentUser();
            setState({ user: userData, isLoading: false, error: null });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
            setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
            console.error('Error fetching user:', err);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            try {
                const userData = await getCurrentUser();
                if (isMounted) {
                    setState({ user: userData, isLoading: false, error: null });
                }
            } catch (err) {
                if (isMounted) {
                    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data';
                    setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
                }
            }
        };

        loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        ...state,
        refetch: fetchUser,
    };
}

export default useUser;
