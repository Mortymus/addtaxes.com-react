import type { Province } from '../types';

interface Props {
    province: Province;
}

function ProvinceDisplay({ province }: Props) {
    return (
        <div className="province-display">
            <h3 className="province-display__name">{province.provinceName}</h3>
            <div className="d-flex flex-wrap gap-2 mt-3">
                {province.gst !== 0 && (
                    <span className="tax-badge"><span>GST</span>{province.gst}%</span>
                )}
                {province.pst !== 0 && (
                    <span className="tax-badge"><span>PST</span>{province.pst}%</span>
                )}
                {province.hst !== 0 && (
                    <span className="tax-badge"><span>HST</span>{province.hst}%</span>
                )}
            </div>
        </div>
    );
}

export default ProvinceDisplay;