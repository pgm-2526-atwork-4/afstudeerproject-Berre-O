import { error, redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const session = await locals.auth.getSession();
    
    if (!session) throw redirect(303, '/login');

    if (locals.userProfile?.admin !== true) {
        throw error(403, { message: 'Not Authorized' });
    }

    return {
        user: locals.userProfile
    };
};