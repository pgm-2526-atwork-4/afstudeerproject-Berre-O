import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
    const currentPage = Number(event.url.searchParams.get('page') ?? '1');
    const perPage = 8;

    // Replace with your actual data source
    const allLogs = [
        { id: 1, date: '13/02/2026', time: '9:31', action: 'Software Uitgezet', client: 'Restaurant naam', user: 'Persoon naam' },
        { id: 2, date: '13/02/2026', time: '9:25', action: 'Software Aangezet', client: 'Café naam', user: 'Persoon naam' },
        { id: 3, date: '12/02/2026', time: '14:10', action: 'Klant Aangemaakt', client: 'Restaurant naam', user: 'Persoon naam' },
        { id: 4, date: '12/02/2026', time: '13:45', action: 'Licentie Verlengd', client: 'Hotel naam', user: 'Persoon naam' },
        { id: 5, date: '11/02/2026', time: '16:00', action: 'Software Uitgezet', client: 'Bar naam', user: 'Persoon naam' },
        { id: 6, date: '11/02/2026', time: '11:30', action: 'Klant Verwijderd', client: 'Café naam', user: 'Persoon naam' },
        { id: 7, date: '10/02/2026', time: '10:15', action: 'Software Aangezet', client: 'Restaurant naam', user: 'Persoon naam' },
        { id: 8, date: '10/02/2026', time: '9:00', action: 'Licentie Verlengd', client: 'Hotel naam', user: 'Persoon naam' },
        { id: 9, date: '09/02/2026', time: '15:20', action: 'Klant Aangemaakt', client: 'Bar naam', user: 'Persoon naam' },
        { id: 10, date: '09/02/2026', time: '12:00', action: 'Software Uitgezet', client: 'Café naam', user: 'Persoon naam' },
        { id: 11, date: '08/02/2026', time: '14:30', action: 'Software Aangezet', client: 'Restaurant naam', user: 'Persoon naam' },
        { id: 12, date: '08/02/2026', time: '10:45', action: 'Klant Aangemaakt', client: 'Hotel naam', user: 'Persoon naam' },
        { id: 13, date: '07/02/2026', time: '9:15', action: 'Licentie Verlengd', client: 'Bar naam', user: 'Persoon naam' },
    ];

    const totalPages = Math.ceil(allLogs.length / perPage);
    const start = (currentPage - 1) * perPage;
    const paginatedLogs = allLogs.slice(start, start + perPage);

    return {
        logs: paginatedLogs,
        currentPage,
        totalPages,
    };
};