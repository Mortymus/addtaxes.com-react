import { useState } from 'react';

const siteUrl = 'https://addtaxes.com/';
const shareMessage = 'Canadian sales tax calculator for GST, PST, HST and tips';

const shareLinks = [
    {
        label: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
        label: 'LinkedIn',
        href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    },
    {
        label: 'X',
        href: `https://twitter.com/intent/tweet?${new URLSearchParams({
            text: shareMessage,
            url: siteUrl,
        })}`,
    },
    {
        label: 'Email',
        href: `mailto:?${new URLSearchParams({
            subject: 'Canadian sales tax and tip calculator',
            body: `${shareMessage}: ${siteUrl}`,
        })}`,
    },
];

function ShareLinks() {
    const [copyStatus, setCopyStatus] = useState('');

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(siteUrl);
            setCopyStatus('Link copied.');
        } catch {
            setCopyStatus(`Copy unavailable. You can share this link: ${siteUrl}`);
        }
    };

    return (
        <section className="share-card" aria-labelledby="share-title">
            <div>
                <h2 className="share-card__title" id="share-title">
                    Know someone who could use this?
                </h2>
                <p className="share-card__description mb-0">
                    Share the Canadian tax and tip calculator.
                </p>
            </div>
            <div className="share-card__actions" aria-label="Share addtaxes.com">
                {shareLinks.map((link) => (
                    <a
                        key={link.label}
                        className="share-link"
                        href={link.href}
                        target={link.label === 'Email' ? undefined : '_blank'}
                        rel={link.label === 'Email' ? undefined : 'noopener noreferrer'}
                    >
                        {link.label}
                    </a>
                ))}
                <button className="share-link" type="button" onClick={copyLink}>
                    Copy link
                </button>
            </div>
            <p className="share-card__status mb-0" aria-live="polite">
                {copyStatus}
            </p>
        </section>
    );
}

export default ShareLinks;
