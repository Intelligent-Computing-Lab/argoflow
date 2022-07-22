import {Page, SlidingPanel} from 'argo-ui';
import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import {Link, RouteComponentProps} from 'react-router-dom';
import {WorkflowTemplate} from '../../../../models';
import {uiUrl} from '../../../shared/base';
import {ErrorNotice} from '../../../shared/components/error-notice';
import ExampleManifests from '../../../shared/components/example-manifests';
import {InfoIcon} from '../../../shared/components/fa-icons';
import {Loading} from '../../../shared/components/loading';
import {PaginationPanel} from '../../../shared/components/pagination-panel';
import {Timestamp} from '../../../shared/components/timestamp';
import {ZeroState} from '../../../shared/components/zero-state';
import {Context} from '../../../shared/context';
import {Footnote} from '../../../shared/footnote';
import {historyUrl} from '../../../shared/history';
import {Pagination, parseLimit} from '../../../shared/pagination';
import {ScopedLocalStorage} from '../../../shared/scoped-local-storage';
import {services} from '../../../shared/services';
import {useQueryParams} from '../../../shared/use-query-params';
import {Utils} from '../../../shared/utils';
import {WorkflowTemplateCreator} from '../workflow-template-creator';
import {WorkflowTemplateFilters} from '../workflow-template-filters/workflow-template-filters';
import { useTranslation,Trans } from 'react-i18next';

require('./workflow-template-list.scss');

// const learnMore = <a href='https://argoproj.github.io/argo-workflows/workflow-templates/'>Learn more</a>;
const learnMore = '';

export const WorkflowTemplateList = ({match, location, history}: RouteComponentProps<any>) => {
    const { t, i18n } = useTranslation();
    // boiler-plate
    const queryParams = new URLSearchParams(location.search);
    const {navigation} = useContext(Context);

    const storage = new ScopedLocalStorage('WorkflowTemplateListOptions');
    const savedOptions = storage.getItem('paginationLimit', 0);

    // state for URL and query parameters
    const [namespace, setNamespace] = useState(Utils.getNamespace(match.params.namespace) || '');
    const [sidePanel, setSidePanel] = useState(queryParams.get('sidePanel') === 'true');

    const [labels, setLabels] = useState([]);
    const [pagination, setPagination] = useState<Pagination>({
        offset: queryParams.get('offset'),
        limit: parseLimit(queryParams.get('limit')) || savedOptions.paginationLimit || 500
    });

    useEffect(
        useQueryParams(history, p => {
            setSidePanel(p.get('sidePanel') === 'true');
        }),
        [history]
    );

    useEffect(
        () =>
            history.push(
                historyUrl('workflow-templates' + (Utils.managedNamespace ? '' : '/{namespace}'), {
                    namespace,
                    sidePanel
                })
            ),
        [namespace, sidePanel]
    );

    // internal state
    const [error, setError] = useState<Error>();
    const [templates, setTemplates] = useState<WorkflowTemplate[]>();
    useEffect(() => {
        services.workflowTemplate
            .list(namespace, labels, pagination)
            .then(list => {
                setPagination({...pagination, nextOffset: list.metadata.continue});
                setTemplates(list.items || []);
            })
            .then(() => setError(null))
            .catch(setError);
    }, [namespace, labels, pagination.offset, pagination.limit]);
    useEffect(() => {
        storage.setItem('paginationLimit', pagination.limit, 0);
    }, [pagination.limit, labels]);

    return (
        <Page
            title='Workflow Templates'
            toolbar={{
                breadcrumbs: [
                    {title: 'Workflow Templates', path: uiUrl('workflow-templates')},
                    {title: namespace, path: uiUrl('workflow-templates/' + namespace)}
                ],
                actionMenu: {
                    items: [
                        {
                            title: <p>{t('tips.tip11')}</p>,
                            iconClassName: 'fa fa-plus',
                            action: () => setSidePanel(true)
                        }
                    ]
                }
            }}>
            <div className='row'>
                <div className='columns small-12 xlarge-2'>
                    <div>
                        <WorkflowTemplateFilters
                            templates={templates || []}
                            namespace={namespace}
                            labels={labels}
                            onChange={(namespaceValue: string, labelsValue: string[]) => {
                                setNamespace(namespaceValue);
                                setLabels(labelsValue);
                            }}
                        />
                    </div>
                </div>
                <div className='columns small-12 xlarge-10'>
                    <ErrorNotice error={error} />
                    {!templates ? (
                        <Loading />
                    ) : templates.length === 0 ? (
                        <ZeroState title={t('tips.tip9')}>
                            <p>{t('submit.s1')}</p>
                            <p>
                                <ExampleManifests />. {learnMore}.
                            </p>
                        </ZeroState>
                    ) : (
                        <>
                            <div className='argo-table-list'>
                                <div className='row argo-table-list__head'>
                                    <div className='columns small-1' />
                                    <div className='columns small-5'>{t('tips.tip6')}</div>
                                    <div className='columns small-3'>{t('tips.tip1')}</div>
                                    <div className='columns small-3'>{t('tips.tip7')}</div>
                                </div>
                                {templates.map(t => (
                                    <Link
                                        className='row argo-table-list__row'
                                        key={`${t.metadata.namespace}/${t.metadata.name}`}
                                        to={uiUrl(`workflow-templates/${t.metadata.namespace}/${t.metadata.name}`)}>
                                        <div className='columns small-1'>
                                            <i className='fa fa-clone' />
                                        </div>
                                        <div className='columns small-5'>{t.metadata.name}</div>
                                        <div className='columns small-3'>{t.metadata.namespace}</div>
                                        <div className='columns small-3'>
                                            <Timestamp date={t.metadata.creationTimestamp} />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Footnote>
                                <InfoIcon /> {t('tips.tip12')}. <ExampleManifests />. {learnMore}.
                            </Footnote>
                            <PaginationPanel onChange={setPagination} pagination={pagination} numRecords={null} />
                        </>
                    )}
                </div>
            </div>
            <SlidingPanel isShown={sidePanel} onClose={() => setSidePanel(false)}>
                <WorkflowTemplateCreator namespace={namespace} onCreate={wf => navigation.goto(uiUrl(`workflow-templates/${wf.metadata.namespace}/${wf.metadata.name}`))} />
            </SlidingPanel>
        </Page>
    );
};

