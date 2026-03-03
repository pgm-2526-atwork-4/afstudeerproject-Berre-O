<script lang="ts">
    let { data } = $props();

    function getMaxCount(items: { count: number }[]) {
        return Math.max(...items.map(i => i.count));
    }

    function getActivityClass(type: string) {
        switch (type) {
            case 'success': return 'activity--success';
            case 'warning': return 'activity--warning';
            case 'danger': return 'activity--danger';
            case 'info': return 'activity--info';
            default: return '';
        }
    }

    function getActivityIcon(type: string) {
        switch (type) {
            case 'success': return 'fa-circle-check';
            case 'warning': return 'fa-triangle-exclamation';
            case 'danger': return 'fa-circle-xmark';
            case 'info': return 'fa-circle-info';
            default: return 'fa-circle';
        }
    }
</script>

<h1>Statistics</h1>

<section class="kpi-grid">
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--primary">
            <i class="fa-solid fa-users"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Totaal Klanten</span>
            <span class="kpi-card__value">{data.stats.totalClients}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--success">
            <i class="fa-solid fa-user-check"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Actieve Klanten</span>
            <span class="kpi-card__value">{data.stats.activeClients}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--warning">
            <i class="fa-solid fa-clock"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Bijna Verlopen</span>
            <span class="kpi-card__value">{data.stats.expiringSoon}</span>
        </div>
    </div>
    <div class="kpi-card">
        <div class="kpi-card__icon kpi-card__icon--accent">
            <i class="fa-solid fa-euro-sign"></i>
        </div>
        <div class="kpi-card__content">
            <span class="kpi-card__label">Maandelijkse Omzet</span>
            <span class="kpi-card__value">{data.stats.revenue}</span>
        </div>
    </div>
</section>

<section class="charts-row">
    <div class="chart-card">
        <h2 class="chart-card__title">Nieuwe Klanten per Maand</h2>
        <div class="bar-chart">
            {#each data.monthlyNewClients as item}
                <div class="bar-chart__column">
                    <div class="bar-chart__bar-wrapper">
                        <span class="bar-chart__count">{item.count}</span>
                        <div
                            class="bar-chart__bar"
                            style="height: {(item.count / getMaxCount(data.monthlyNewClients)) * 100}%"
                        ></div>
                    </div>
                    <span class="bar-chart__label">{item.month}</span>
                </div>
            {/each}
        </div>
    </div>

    <div class="chart-card">
        <h2 class="chart-card__title">Klanten per Type</h2>
        <div class="type-list">
            {#each data.clientsByType as item}
                <div class="type-item">
                    <div class="type-item__info">
                        <i class="fa-solid {item.icon} type-item__icon"></i>
                        <span class="type-item__name">{item.type}</span>
                    </div>
                    <div class="type-item__bar-wrapper">
                        <div
                            class="type-item__bar"
                            style="width: {(item.count / getMaxCount(data.clientsByType)) * 100}%"
                        ></div>
                    </div>
                    <span class="type-item__count">{item.count}</span>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="charts-row">
    <div class="chart-card">
        <h2 class="chart-card__title">Software Status</h2>
        <div class="donut-stats">
            <div class="donut">
                <svg viewBox="0 0 36 36" class="donut__svg">
                    <path
                        class="donut__ring"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        stroke-width="3"
                    />
                    <path
                        class="donut__segment donut__segment--active"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke-width="3"
                        stroke-dasharray="{Math.round((data.stats.softwareActive / data.stats.totalClients) * 100)}, 100"
                    />
                </svg>
                <div class="donut__label">
                    <span class="donut__percentage">{Math.round((data.stats.softwareActive / data.stats.totalClients) * 100)}%</span>
                    <span class="donut__text">Actief</span>
                </div>
            </div>
            <div class="donut-legend">
                <div class="donut-legend__item">
                    <span class="donut-legend__dot donut-legend__dot--active"></span>
                    <span>Actief</span>
                    <strong>{data.stats.softwareActive}</strong>
                </div>
                <div class="donut-legend__item">
                    <span class="donut-legend__dot donut-legend__dot--inactive"></span>
                    <span>Inactief</span>
                    <strong>{data.stats.softwareInactive}</strong>
                </div>
            </div>
        </div>
    </div>

    <div class="chart-card">
        <h2 class="chart-card__title">Abonnementen</h2>
        <div class="subscription-list">
            {#each data.subscriptionDistribution as sub}
                <div class="subscription-item">
                    <div class="subscription-item__header">
                        <span class="subscription-item__name">{sub.type}</span>
                        <span class="subscription-item__count">{sub.count} klanten</span>
                    </div>
                    <div class="subscription-item__bar-bg">
                        <div
                            class="subscription-item__bar"
                            style="width: {sub.percentage}%"
                        ></div>
                    </div>
                    <span class="subscription-item__percentage">{sub.percentage}%</span>
                </div>
            {/each}
        </div>
    </div>
</section>

<section class="chart-card chart-card--full">
    <h2 class="chart-card__title">Recente Activiteit</h2>
    <div class="activity-list">
        {#each data.recentActivity as item (item.id)}
            <div class="activity-item {getActivityClass(item.type)}">
                <i class="fa-solid {getActivityIcon(item.type)} activity-item__icon"></i>
                <div class="activity-item__content">
                    <span class="activity-item__action">{item.action}</span>
                    <span class="activity-item__client">{item.client}</span>
                </div>
                <span class="activity-item__date">{item.date}</span>
            </div>
        {/each}
    </div>
</section>

<style>
    .kpi-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1.5rem;
        margin-bottom: 2rem;
    }

    .kpi-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.25rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .kpi-card__icon {
        width: 48px;
        height: 48px;
        border-radius: 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        flex-shrink: 0;
    }

    .kpi-card__icon--primary {
        background: color-mix(in srgb, var(--color-accent) 15%, transparent);
        color: var(--color-accent);
    }

    .kpi-card__icon--success {
        background: #e8f5e9;
        color: #2e7d32;
    }

    .kpi-card__icon--warning {
        background: #fff3e0;
        color: #e65100;
    }

    .kpi-card__icon--accent {
        background: color-mix(in srgb, var(--color-secondary) 15%, transparent);
        color: var(--color-secondary);
    }

    .kpi-card__content {
        display: flex;
        flex-direction: column;
    }

    .kpi-card__label {
        font-size: 0.8rem;
        color: #999;
        font-weight: 500;
    }

    .kpi-card__value {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }

    /* Charts */
    .charts-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }

    .chart-card {
        background: white;
        border-radius: 0.75rem;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .chart-card--full {
        margin-bottom: 2rem;
    }

    .chart-card__title {
        font-size: 1rem;
        font-weight: 600;
        color: #333;
        margin: 0 0 1.25rem;
    }

    .bar-chart {
        display: flex;
        align-items: flex-end;
        gap: 1rem;
        height: 200px;
        padding-top: 1rem;
    }

    .bar-chart__column {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
    }

    .bar-chart__bar-wrapper {
        flex: 1;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
    }

    .bar-chart__bar {
        width: 60%;
        background: linear-gradient(180deg, var(--color-secondary), var(--color-accent));
        border-radius: 0.35rem 0.35rem 0 0;
        min-height: 8px;
        transition: height 0.5s ease;
    }

    .bar-chart__count {
        font-size: 0.75rem;
        font-weight: 600;
        color: #666;
        margin-bottom: 0.25rem;
    }

    .bar-chart__label {
        font-size: 0.8rem;
        color: #999;
        margin-top: 0.5rem;
    }

    .type-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .type-item {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .type-item__info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-width: 120px;
    }

    .type-item__icon {
        color: var(--color-secondary);
        font-size: 1rem;
        width: 20px;
        text-align: center;
    }

    .type-item__name {
        font-size: 0.9rem;
        color: #444;
        font-weight: 500;
    }

    .type-item__bar-wrapper {
        flex: 1;
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
    }

    .type-item__bar {
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent), var(--color-secondary));
        border-radius: 4px;
        transition: width 0.5s ease;
    }

    .type-item__count {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
        min-width: 30px;
        text-align: right;
    }

    .donut-stats {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .donut {
        position: relative;
        width: 140px;
        height: 140px;
        flex-shrink: 0;
    }

    .donut__svg {
        width: 100%;
        height: 100%;
        transform: rotate(-90deg);
    }

    .donut__segment--active {
        stroke: var(--color-secondary);
        stroke-linecap: round;
    }

    .donut__label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        display: flex;
        flex-direction: column;
    }

    .donut__percentage {
        font-size: 1.5rem;
        font-weight: 700;
        color: #333;
    }

    .donut__text {
        font-size: 0.75rem;
        color: #999;
    }

    .donut-legend {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .donut-legend__item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        color: #444;
    }

    .donut-legend__item strong {
        margin-left: auto;
    }

    .donut-legend__dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
    }

    .donut-legend__dot--active {
        background: var(--color-secondary);
    }

    .donut-legend__dot--inactive {
        background: #eee;
    }

    .subscription-list {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .subscription-item__header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.35rem;
    }

    .subscription-item__name {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
    }

    .subscription-item__count {
        font-size: 0.8rem;
        color: #999;
    }

    .subscription-item__bar-bg {
        height: 8px;
        background: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.25rem;
    }

    .subscription-item__bar {
        height: 100%;
        background: linear-gradient(90deg, var(--color-accent), var(--color-secondary));
        border-radius: 4px;
        transition: width 0.5s ease;
    }

    .subscription-item__percentage {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-secondary);
    }

    /* Activity */
    .activity-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .activity-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        background: #fafafa;
        border-left: 3px solid transparent;
    }

    .activity--success {
        border-left-color: #4caf50;
    }

    .activity--warning {
        border-left-color: #ff9800;
    }

    .activity--danger {
        border-left-color: #f44336;
    }

    .activity--info {
        border-left-color: var(--color-accent);
    }

    .activity-item__icon {
        font-size: 1rem;
        width: 20px;
        text-align: center;
    }

    .activity--success .activity-item__icon { color: #4caf50; }
    .activity--warning .activity-item__icon { color: #ff9800; }
    .activity--danger .activity-item__icon { color: #f44336; }
    .activity--info .activity-item__icon { color: var(--color-accent); }

    .activity-item__content {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .activity-item__action {
        font-size: 0.9rem;
        font-weight: 600;
        color: #333;
    }

    .activity-item__client {
        font-size: 0.8rem;
        color: #999;
    }

    .activity-item__date {
        font-size: 0.8rem;
        color: #bbb;
        flex-shrink: 0;
    }

    /* Responsive */
    @media (max-width: 1024px) {
        .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .charts-row {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .kpi-grid {
            grid-template-columns: 1fr;
        }

        .donut-stats {
            flex-direction: column;
        }
    }
</style>