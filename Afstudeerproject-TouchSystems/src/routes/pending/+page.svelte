<script lang="ts">
    import { createBrowserClient } from '@supabase/ssr';

    let { data } = $props();
    const supabase = createBrowserClient(data.supabase.url, data.supabase.anonKey);

    async function signOut() {
        await supabase.auth.signOut();
        window.location.href = '/';
    }
</script>

<div class="pending-page">
  <div class="pending-card">
    <div class="pending-card__icon">
      <i class="fa-solid fa-hourglass-half"></i>
    </div>

    <div class="pending-card__content">
      <h1 class="pending-card__title">Account in afwachting</h1>
      <p class="pending-card__subtitle">
        Je account is aangemaakt en wacht op goedkeuring van een beheerder.
        Je ontvangt een melding zodra je toegang hebt.
      </p>

      <div class="pending-card__steps">
        <div class="step step--done">
          <div class="step__indicator">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="step__text">
            <span class="step__label">Account aangemaakt</span>
            <span class="step__desc">Je registratie is ontvangen</span>
          </div>
        </div>

        <div class="step__connector"></div>

        <div class="step step--active">
          <div class="step__indicator">
            <span class="step__pulse"></span>
            <i class="fa-solid fa-clock"></i>
          </div>
          <div class="step__text">
            <span class="step__label">Wachten op goedkeuring</span>
            <span class="step__desc">Een beheerder beoordeelt je aanvraag</span>
          </div>
        </div>

        <div class="step__connector"></div>

        <div class="step step--pending">
          <div class="step__indicator">
            <i class="fa-solid fa-door-open"></i>
          </div>
          <div class="step__text">
            <span class="step__label">Toegang verleend</span>
            <span class="step__desc">Je kan het dashboard gebruiken</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pending-card__footer">
        <button onclick={signOut} class="btn-signout"><i class="fa-solid fa-arrow-right-from-bracket"></i>Sign Out</button>
    </div>
  </div>
</div>

<style>
  .pending-page {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f8fa;
    padding: 2rem;
  }

  .pending-card {
    background: white;
    border-radius: 1.25rem;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
    padding: 3rem;
    max-width: 480px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    text-align: center;
  }

  .pending-card__icon {
    width: 72px;
    height: 72px;
    border-radius: 1.25rem;
    background: #fff3e0;
    color: #e65100;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    animation: sway 3s ease-in-out infinite;
  }

  @keyframes sway {
    0%, 100% { transform: rotate(-8deg); }
    50% { transform: rotate(8deg); }
  }

  .pending-card__content {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
  }

  .pending-card__title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
  }

  .pending-card__subtitle {
    font-size: 0.9rem;
    color: #888;
    line-height: 1.6;
    margin: 0 0 1rem;
  }

  .pending-card__steps {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
    text-align: left;
    width: 100%;
    margin-top: 0.5rem;
  }

  .step {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  .step__connector {
    width: 2px;
    height: 28px;
    background: #f0f0f0;
    margin-left: 19px;
  }

  .step__indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    flex-shrink: 0;
    position: relative;
    background: #f5f5f5;
    color: #ccc;
  }

  .step--done .step__indicator {
    background: #e8f5e9;
    color: #2e7d32;
  }

  .step--active .step__indicator {
    background: #fff3e0;
    color: #e65100;
  }

  .step__pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #fff3e0;
    animation: pulse 2s ease-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  .step__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .step__label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
  }

  .step--pending .step__label {
    color: #bbb;
  }

  .step__desc {
    font-size: 0.775rem;
    color: #aaa;
  }

  .pending-card__footer {
    width: 100%;
    border-top: 1px solid #f0f0f0;
    padding-top: 1.5rem;
  }

  .btn-signout {
    width: 100%;
    padding: 0.65rem 1.25rem;
    border-radius: 0.6rem;
    border: 1px solid #e5e7eb;
    background: white;
    color: #666;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .btn-signout:hover {
    background: #fdecea;
    color: var(--color-secondary);
    border-color: #f5c6c6;
  }
</style>