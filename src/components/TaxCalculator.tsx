import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Province } from '../types';

type CalculationMode = 'add' | 'deduct' | 'portion';

interface Props {
    province: Province;
}

interface CalculationResult {
    provinceName: string;
    calculationMode: CalculationMode | null;
    baseAmount: number;
    gstAmount: number;
    pstAmount: number;
    hstAmount: number;
    taxAmount: number;
    totalAmount: number;
    tipRate: number;
    tipAmount: number;
    amountDue: number;
    taxShare: number;
}

const tipRates = [0, 5, 10, 15, 20, 25, 30];

const currencyFormatter = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
});

function formatCurrency(amount: number): string {
    return currencyFormatter.format(amount);
}

function TaxCalculator({ province }: Props) {
    const [amount, setAmount] = useState('');
    const [tipRate, setTipRate] = useState(0);
    const [calculationMode, setCalculationMode] = useState<CalculationMode | null>(null);
    const [result, setResult] = useState<CalculationResult | null>(null);
    const [error, setError] = useState('');

    const calculate = (
        mode: CalculationMode | null,
        selectedTipRate = tipRate,
        requirePositiveBase = false,
    ): boolean => {
        const normalizedAmount = amount.trim().replace(',', '.');
        const enteredAmount = Number(normalizedAmount);

        if (normalizedAmount === '' || !Number.isFinite(enteredAmount) || enteredAmount < 0) {
            setResult(null);
            setError('Enter a valid amount of zero or more.');
            return false;
        }

        const combinedRate = province.gst + province.pst + province.hst;
        const baseAmount = mode === null || mode === 'add'
            ? enteredAmount
            : enteredAmount / (1 + combinedRate / 100);
        const gstAmount = mode === null ? 0 : baseAmount * province.gst / 100;
        const pstAmount = mode === null ? 0 : baseAmount * province.pst / 100;
        const hstAmount = mode === null ? 0 : baseAmount * province.hst / 100;
        const taxAmount = gstAmount + pstAmount + hstAmount;
        const totalAmount = mode === 'add' ? baseAmount + taxAmount : enteredAmount;
        if ((requirePositiveBase || mode !== null) && baseAmount <= 0) {
            setResult(null);
            setError('Enter an amount greater than zero.');
            return false;
        }
        const tipBaseAmount = mode === 'deduct' ? baseAmount : totalAmount;
        const tipAmount = tipBaseAmount * selectedTipRate / 100;

        setResult({
            provinceName: province.provinceName,
            calculationMode: mode,
            baseAmount,
            gstAmount,
            pstAmount,
            hstAmount,
            taxAmount,
            totalAmount,
            tipRate: selectedTipRate,
            tipAmount,
            amountDue: totalAmount + tipAmount,
            taxShare: totalAmount === 0 ? 0 : taxAmount / totalAmount * 100,
        });
        setError('');
        return true;
    };

    const currentResult = result?.provinceName === province.provinceName ? result : null;
    const taxRows = [
        { label: 'GST', amount: currentResult?.gstAmount ?? 0, rate: province.gst },
        { label: 'PST', amount: currentResult?.pstAmount ?? 0, rate: province.pst },
        { label: 'HST', amount: currentResult?.hstAmount ?? 0, rate: province.hst },
    ].filter((tax) => currentResult?.calculationMode !== null && tax.rate > 0);

    return (
        <section className="calculator-card card border-0" aria-labelledby="calculator-title">
            <div className="card-body p-4 p-md-5">
                <div className="calculator-heading">
                    <p className="eyebrow mb-2">PERSONAL TAX CALCULATOR</p>
                    <h2 className="section-title mb-2" id="calculator-title">
                        Calculate your total
                    </h2>
                    <p className="calculator-description mb-0">
                        Apply {province.provinceName}’s sales taxes to any amount.
                    </p>
                </div>

                <form
                    className="calculator-form"
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        if (calculate('add')) {
                            setCalculationMode('add');
                        }
                    }}
                    noValidate
                >
                    <div className="calculator-entry-layout">
                        <div className="calculator-input-group">
                            <label className="form-label picker-label" htmlFor="calculator-amount">
                                Amount in CAD
                            </label>
                            <div className="input-group calculator-input">
                                <span className="input-group-text">$</span>
                                <input
                                    id="calculator-amount"
                                    className="form-control"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(event) => {
                                        setAmount(event.currentTarget.value);
                                        setCalculationMode(null);
                                        setResult(null);
                                        setError('');
                                    }}
                                    aria-describedby={error ? 'calculator-error' : 'calculator-hint'}
                                    aria-invalid={Boolean(error)}
                                />
                                <button
                                    className="input-group-text calculator-clear"
                                    type="button"
                                    onClick={() => {
                                        setAmount('');
                                        setTipRate(0);
                                        setCalculationMode(null);
                                        setResult(null);
                                        setError('');
                                    }}
                                    aria-label="Clear amount"
                                >
                                    Clear
                                </button>
                                <span className="input-group-text">CAD</span>
                            </div>
                            {error ? (
                                <div className="calculator-error" id="calculator-error" role="alert">
                                    {error}
                                </div>
                            ) : (
                                <div className="calculator-hint" id="calculator-hint">
                                    PLease enter an amount and choose how you’d like to apply taxes.
                                </div>
                            )}
                        </div>

                        <div className="calculator-actions" aria-label="Calculation options">
                            <button
                                className={`btn calculator-button calculator-button--primary${calculationMode === 'add' ? ' calculator-button--selected' : ''}`}
                                type="submit"
                                aria-pressed={calculationMode === 'add'}
                            >
                                Add taxes
                            </button>
                            <button
                                className={`btn calculator-button calculator-button--secondary${calculationMode === 'deduct' ? ' calculator-button--selected' : ''}`}
                                type="button"
                                aria-pressed={calculationMode === 'deduct'}
                                onClick={() => {
                                    if (calculate('deduct')) {
                                        setCalculationMode('deduct');
                                    }
                                }}
                            >
                                Deduct included taxes
                            </button>
                            <button
                                className={`btn calculator-button calculator-button--secondary${calculationMode === 'portion' ? ' calculator-button--selected' : ''}`}
                                type="button"
                                aria-pressed={calculationMode === 'portion'}
                                onClick={() => {
                                    if (calculate('portion')) {
                                        setCalculationMode('portion');
                                    }
                                }}
                            >
                                Calculate tax portion
                            </button>
                        </div>
                    </div>

                    <fieldset className="tip-selector">
                        <legend className="form-label picker-label">Add a tip</legend>
                        <div className="tip-options" role="group" aria-label="Tip percentage">
                            {tipRates.map((rate) => (
                                <button
                                    key={rate}
                                    className={`btn tip-option${tipRate === rate ? ' tip-option--selected' : ''}`}
                                    type="button"
                                    aria-pressed={tipRate === rate}
                                    onClick={() => {
                                        setTipRate(rate);
                                        if (amount.trim() === '') {
                                            setResult(null);
                                            setError('');
                                            return;
                                        }
                                        calculate(calculationMode, rate, true);
                                    }}
                                >
                                    {rate === 0 ? 'No tip' : `${rate}%`}
                                </button>
                            ))}
                        </div>
                        <p className="tip-hint mb-0">
                            Tip is calculated from the total amount for the selected calculation.
                        </p>
                    </fieldset>
                </form>

                {currentResult && (
                    <div className="calculator-result" aria-live="polite" aria-atomic="true">
                        <div className="calculator-result__header">
                            <div>
                                <p className="eyebrow mb-1">YOUR BREAKDOWN</p>
                                <h3 className="calculator-result__title mb-0">Estimated amounts</h3>
                            </div>                          
                        </div>

                        <div className="calculator-result__rows">
                            <div className="calculator-result__row">
                                <span>{currentResult.calculationMode === null ? 'Amount' : 'Before tax'}</span>
                                <strong>{formatCurrency(currentResult.baseAmount)}</strong>
                            </div>
                            {taxRows.map((tax) => (
                                <div className="calculator-result__row calculator-result__row--tax" key={tax.label}>
                                    <span>{tax.label} ({tax.rate}%)</span>
                                    <strong>{formatCurrency(tax.amount)}</strong>
                                </div>
                            ))}
                            <div className="calculator-result__row calculator-result__row--total">
                                <span>
                                    {currentResult.calculationMode === null
                                        ? 'Amount before tip'
                                        : currentResult.calculationMode === 'deduct'
                                            ? `${currentResult.tipRate > 0 ? 'Subtotal' : 'Total'} excluding tax`
                                            : `${currentResult.tipRate > 0 ? 'Subtotal' : 'Total'} including tax`}
                                </span>
                                <strong>
                                    {formatCurrency(
                                        currentResult.calculationMode === 'deduct'
                                            ? currentResult.baseAmount
                                            : currentResult.totalAmount,
                                    )}
                                </strong>
                            </div>
                            {currentResult.tipRate > 0 && (
                                <>
                                    <div className="calculator-result__row calculator-result__row--tip">
                                        <span>Tip ({currentResult.tipRate}%)</span>
                                        <strong>{formatCurrency(currentResult.tipAmount)}</strong>
                                    </div>
                                    <div className="calculator-result__row calculator-result__row--grand-total">
                                        <span>
                                            {currentResult.calculationMode === null
                                                ? 'Total including tip'
                                                : 'Total including tax and tip'}
                                        </span>
                                        <strong>{formatCurrency(currentResult.amountDue)}</strong>
                                    </div>
                                </>
                            )}
                        </div>
                        {currentResult.calculationMode !== null && (
                            <p className="calculator-result__note mb-0">
                                Applicable taxes total {formatCurrency(currentResult.taxAmount)}.
                                {currentResult.taxShare > 0 && <> They make up {currentResult.taxShare.toFixed(2)}% of the tax-included total.</>}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

export default TaxCalculator;
