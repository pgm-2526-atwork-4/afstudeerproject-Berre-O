<h1>Home</h1>
<section class="section section--boxes">
    <div class="box">
        <img src="" alt="test">
        <div class="box__text">
            <h2>Actieve klanten</h2>
            <p>5</p>
        </div>
    </div>
    <div class="box">
        <img src="" alt="test">
        <div class="box__text">
            <h2>Bijna verlopen</h2>
            <p>2</p>
        </div>
    </div>
    <div class="box">
        <img src="" alt="test">
        <div class="box__text">
            <h2>Nieuw deze maand</h2>
            <p>3</p>
        </div>
    </div>
</section>

<section class="section section--table">
    <table class="table">
        <thead class="table__head">
            <tr class="table__row">
                <th class="table__item table__item--head">Naam</th>
                <th class="table__item table__item--head">Type</th>
                <th class="table__item table__item--head">Verval Datum</th>
                <th class="table__item table__item--head">Status</th>
                <th class="table__item table__item--head">Software</th>
                <th class="table__item table__item--head">Ondernemings-Nummer</th>
                <th class="table__item table__item--head">Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr class="table__row">
                <td class="table__item">TestCafe</td>
                <td class="table__item">Café</td>
                <td class="table__item">28/02/2026</td>
                <td class="table__item">
                    <div class="status"><span class="state state--yellow"></span> Bijna Verlopen</div>
                </td>
                <td class="table__item">
                    <div class="icon icon--active"><span>⏻</span> Actief</div>
                </td>
                <td class="table__item">0879867756464554</td>
                <td class="table__item"><a href="search/1" data-sveltekit-preload-data>></a></td>
            </tr>
            <tr class="table__row">
                <td class="table__item">TestRestaurant</td>
                <td class="table__item">Restaurant</td>
                <td class="table__item">31/03/2027</td>
                <td class="table__item">
                    <div class="status"><span class="state state--green"></span> Betaald</div>
                </td>
                <td class="table__item">
                    <div class="icon icon--inactive"><span>⏻</span> Niet-Actief</div>
                </td>
                <td class="table__item">0879867756464554</td>
                <td class="table__item">></td>
            </tr>
            <tr class="table__row">
                <td class="table__item">&nbsp;</td>
                <td class="table__item"></td>
                <td class="table__item"></td>
                <td class="table__item"></td>
                <td class="table__item"></td>
                <td class="table__item"></td>
                <td class="table__item">></td>
            </tr>
        </tbody>
    </table>
</section>

<style>
    .section {
        width: 100%;
        display: flex;
        gap: 2rem;
    }

    .box {
        background-color: white;
        padding: 1rem;
        border-radius: 1rem;
        width: 20rem;
        display: flex;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    .table {
        text-align: left;
        border-collapse: collapse;
        width: 100%;

        .table__head {
            background-color: #fcfcfd;
            border-bottom: 1px solid #eee;
        }

        .table__item {
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 14px;
            color: #444;
        }

        .table__item--head {
            border-bottom: none;
            color: #333;
            font-weight: 600;
        }
    }

    .section--table {
            width: 100%;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
            overflow: hidden;
        }
</style>
