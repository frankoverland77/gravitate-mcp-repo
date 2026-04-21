import { useState } from 'react';
import { Alert } from 'antd';

export function GuidanceBanner() {
    const [visible, setVisible] = useState(
        sessionStorage.getItem('cpp-guidance-banner-dismissed') === '1' ? false : true,
    );

    if (!visible) {
        return null;
    }

    const handleClose = () => {
        sessionStorage.setItem('cpp-guidance-banner-dismissed', '1');
        setVisible(false);
    };

    return (
        <Alert
            type="info"
            showIcon
            closable
            onClose={handleClose}
            message={<strong>About AI Competitor Price Profiling</strong>}
            description="This grid ranks every tracked competitor by how they price at each terminal-product. Hover any column header's i icon to see what the metric means, and hover any confidence pill to see why we rated this particular cell the way we did. Click through any row to open that competitor's detail page."
        />
    );
}
