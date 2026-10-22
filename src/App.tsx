import { useEffect, useState } from 'react';
import type { Province } from './types';
import { provinces } from './provinces';
import ProvinceDisplay from './components/ProvinceDisplay';
import ProvinceDropDown from './components/ProvinceDropDown';
import TaxCalculator from './components/TaxCalculator';
import ShareLinks from './components/ShareLinks';
import './App.css';

const provinceCookieName = 'selectedProvince';

function getSavedProvince(): Province {
  const cookie = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${provinceCookieName}=`));
  const savedName = cookie?.slice(provinceCookieName.length + 1);

  if (!savedName) {
    return provinces[0];
  }

  try {
    const provinceName = decodeURIComponent(savedName);
    return provinces.find((province) => province.provinceName === provinceName) ?? provinces[0];
  } catch {
    return provinces[0];
  }
}

function App() {
  const [ province, setProvince ] = useState<Province>(getSavedProvince);

  useEffect(() => {
    const secureAttribute = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${provinceCookieName}=${encodeURIComponent(province.provinceName)}; max-age=31536000; path=/; SameSite=Lax${secureAttribute}`;
  }, [province]);

  return (
    <div className="app-shell min-vh-100">
      <nav className="navbar app-navbar">
        <div className="container-lg">
          <a className="navbar-brand d-flex align-items-center gap-3 m-0" href="/">
            <span className="brand-mark" aria-hidden="true">a</span>
            <span className="brand-name">addtaxes<span>.com</span></span>
          </a>
          <span className="navbar-note d-none d-sm-flex align-items-center gap-2">
            <span className="status-dot" aria-hidden="true" />
            CANADIAN TAX REFERENCE
          </span>
        </div>
      </nav>

      <main className="container-lg app-main">
        <section className="hero-section row align-items-end gy-4">
          <div className="col-lg-8">
            <p className="eyebrow mb-3">CLEAR RATES. CONFIDENT DECISIONS.</p>
            <h1 className="hero-title mb-3">
              Canadian sales tax,
              <span className="d-block hero-title-accent">without the guesswork.</span>
            </h1>
            <p className="hero-copy mb-0">
              Look up GST, PST and HST by province or territory, calculate taxes or tips for any amount.
            </p>
          </div>
          <div className="col-lg-4">
            <div className="reference-note d-flex align-items-center gap-3">
              <span className="reference-icon" aria-hidden="true">CA</span>
              <div>
                <div className="reference-title">Canada-wide coverage</div>
                <div className="reference-subtitle">All 13 provinces and territories</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rate-card card border-0" aria-labelledby="rate-card-title">
          <div className="card-body p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-4">
              <div>
                <p className="eyebrow mb-2">TAX RATE LOOKUP</p>
                <h2 className="section-title mb-0" id="rate-card-title">
                  Select your region
                </h2>
              </div>
              <div className="region-picker">
                <label className="form-label picker-label" htmlFor="province-picker">
                  Province or territory
                </label>
                <ProvinceDropDown province={province} onClick={setProvince} />
              </div>
            </div>

            <div className="rate-card-divider" />

            <div className="row align-items-center gy-4">
              <div className="col-lg-7">
                <ProvinceDisplay province={province} />
              </div>
              <div className="col-lg-5">
                <div className="combined-rate-panel d-flex align-items-center justify-content-between">
                  <div>
                    <div className="combined-rate-label">Combined sales tax</div>
                    <div className="combined-rate-caption">Total applicable rate</div>
                  </div>
                  <div className="combined-rate-value">
                    {(province.gst + province.pst + province.hst).toLocaleString('en-CA', {
                      maximumFractionDigits: 3,
                    })}
                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer rate-card-footer">
            <span className="footer-check" aria-hidden="true">✓</span>
            Rates shown are for the selected province or territory.
          </div>
        </section>

        <TaxCalculator province={province} />

        <section className="seo-content" aria-labelledby="sales-tax-guide-title">
          <p className="eyebrow mb-2">A SIMPLE CANADIAN TAX GUIDE</p>
          <h2 className="section-title mb-3" id="sales-tax-guide-title">
            GST, PST and HST calculator by province
          </h2>
          <p>
            Canadian sales tax depends on where a purchase is made. Use the province and
            territory selector to see the applicable goods and services tax (GST),
            provincial sales tax (PST), or harmonized sales tax (HST), and the combined rate.
          </p>
          <div className="row g-4">
            <div className="col-md-4">
              <h3>Calculate tax on an amount</h3>
              <p>
                Enter a pre-tax price and add the selected region’s sales taxes to estimate
                the total cost.
              </p>
            </div>
            <div className="col-md-4">
              <h3>Remove tax from a total</h3>
              <p>
                If a price already includes sales tax, calculate the pre-tax amount and
                identify the included tax portion.
              </p>
            </div>
            <div className="col-md-4">
              <h3>Estimate a tip</h3>
              <p>
                Choose a tip percentage from 5% or use another quick option. The calculator
                shows the tip separately and adds it to the amount due.
              </p>
            </div>
          </div>
          <p className="seo-content__note mb-0">
            This calculator provides estimates for convenience. Confirm applicable rates
            with the relevant tax authority for official or tax-filing purposes.
          </p>
        </section>

        <ShareLinks />

        <footer className="page-footer d-flex flex-column flex-sm-row justify-content-between gap-2">
          <span>Made for clarity.</span>
          <span>GST · PST · HST</span>
        </footer>
      </main>
    </div>
  );
}

export default App;