import * as React from 'react';
import { useTranslation,Trans } from 'react-i18next';
function ExampleManifests ()  {
    const { t, i18n } = useTranslation();
    return(    
    <>
        {t('tips.tip6')}{t('submit.s2')}{t('submit.s3')}{t('submit.s4')}{t('tips.tip8')}
    </>
    )
};
export default ExampleManifests;
             
