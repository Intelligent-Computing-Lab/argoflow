import * as React from 'react';
import { useTranslation,Trans } from 'react-i18next';
function ExampleManifests ()  {
    const { t, i18n } = useTranslation();
    return(    
    <>
        {t('tips.tip6')} <a href='https://github.com/argoproj/argo-workflows/tree/master/examples'>{t('tips.tip2')}</a> {t('tips.tip3')}{' '}
        <a href='https://argoproj-labs.github.io/argo-workflows-catalog/'>{t('tips.tip4')}</a>{t('tips.tip5')}
    </>
    )
};
export default ExampleManifests;
             
