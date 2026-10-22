import { useState } from 'react';
import type { Province } from '../types';
import { provinces } from '../provinces';
import ProvinceDisplay from './ProvinceDisplay';

interface Props {
    province: Province;
    onClick: (province: Province) => void;
}

function ProvinceDropDown({ province, onClick }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown province-dropdown">
            <button
                type="button"
                id="province-picker"
                className="btn province-dropdown__trigger dropdown-toggle"
                aria-label="Select province or territory"
                aria-expanded={isOpen}
                aria-controls="province-dropdown-options"
                onClick={() => setIsOpen(!isOpen)}
            >
                <ProvinceDisplay province={province} />
            </button>
            {isOpen && (
                <div
                    id="province-dropdown-options"
                    className="dropdown-menu show province-dropdown__menu"
                    role="listbox"
                    aria-label="Provinces and territories"
                >
                    {provinces.map((item) => (
                        <button
                            key={item.provinceName}
                            type="button"
                            className="dropdown-item province-dropdown__option"
                            role="option"
                            aria-selected={item.provinceName === province.provinceName}
                            onClick={() => {
                                onClick(item);
                                setIsOpen(false);
                            }}
                        >
                            <span>{item.provinceName}</span>
                            <span className="province-dropdown__rate">
                                {[item.gst && `${item.gst}% GST`, item.pst && `${item.pst}% PST`, item.hst && `${item.hst}% HST`]
                                    .filter(Boolean)
                                    .join(' · ')}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ProvinceDropDown;