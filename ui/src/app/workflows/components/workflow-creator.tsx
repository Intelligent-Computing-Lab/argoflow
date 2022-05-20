import {Select} from 'argo-ui/src/components/select/select';
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Workflow, WorkflowTemplate} from '../../../models';
import {Button} from '../../shared/components/button';
import {ErrorNotice} from '../../shared/components/error-notice';
import ExampleManifests from '../../shared/components/example-manifests';
import {UploadButton} from '../../shared/components/upload-button';
import {exampleWorkflow} from '../../shared/examples';
import {services} from '../../shared/services';
import {Utils} from '../../shared/utils';
import {SubmitWorkflowPanel} from './submit-workflow-panel';
import {WorkflowEditor} from './workflow-editor';
import { useTranslation,Trans } from 'react-i18next';
type Stage = 'choose-method' | 'submit-workflow' | 'full-editor';

export const WorkflowCreator = ({namespace, onCreate}: {namespace: string; onCreate: (workflow: Workflow) => void}) => {
    const [workflowTemplates, setWorkflowTemplates] = useState<WorkflowTemplate[]>();
    const [workflowTemplate, setWorkflowTemplate] = useState<WorkflowTemplate>();
    const [stage, setStage] = useState<Stage>('choose-method');
    const [workflow, setWorkflow] = useState<Workflow>();
    const [error, setError] = useState<Error>();
    const { t, i18n } = useTranslation();
    
    useEffect(() => {
        services.workflowTemplate
            .list(namespace, [])
            .then(list => list.items || [])
            .then(setWorkflowTemplates)
            .catch(setError);
    }, [namespace]);

    useEffect(() => {
        switch (stage) {
            case 'full-editor':
                if (workflowTemplate) {
                    setWorkflow({
                        metadata: {
                            generateName: workflowTemplate.metadata.name + '-',
                            namespace,
                            labels: {
                                'workflows.argoproj.io/workflow-template': workflowTemplate.metadata.name,
                                'submit-from-ui': 'true'
                            }
                        },
                        spec: {
                            arguments: workflowTemplate.spec.arguments,
                            workflowTemplateRef: {
                                name: workflowTemplate.metadata.name
                            }
                        }
                    });
                } else {
                    setWorkflow(exampleWorkflow(Utils.getNamespaceWithDefault(namespace)));
                }
                break;
        }
    }, [stage]);

    useEffect(() => {
        if (workflowTemplate) {
            setStage('submit-workflow');
        }
    }, [workflowTemplate]);

    return (
        <>
            {stage === 'choose-method' && (
                <div className='white-box'>
                    <h4>{t('submit.s1')}</h4>
                    <p>{t('submit.s5')}</p>
                    <div style={{margin: 10, marginLeft: 20}}>
                        <Select
                            placeholder={t('submit.s2')}
                            options={workflowTemplates && workflowTemplates.length > 0 ? workflowTemplates.map(tmpl => tmpl.metadata.name) : []}
                            value={workflowTemplate && workflowTemplate.metadata.name}
                            onChange={templateName => setWorkflowTemplate((workflowTemplates || []).find(template => template.metadata.name === templateName.title))}
                        />
                    </div>
                    <p>{t('submit.s3')}</p>
                    <div style={{margin: 10, marginLeft: 20}}>
                        <a onClick={() => setStage('full-editor')}>
                        {t('submit.s4')} <i className='fa fa-caret-right' />
                        </a>
                    </div>
                </div>
            )}
            {stage === 'submit-workflow' && workflowTemplate && (
                <>
                    <SubmitWorkflowPanel
                        kind='WorkflowTemplate'
                        namespace={workflowTemplate.metadata.namespace}
                        name={workflowTemplate.metadata.name}
                        entrypoint={workflowTemplate.spec.entrypoint}
                        templates={workflowTemplate.spec.templates || []}
                        workflowParameters={workflowTemplate.spec.arguments.parameters || []}
                    />
                    <a onClick={() => setStage('full-editor')}>
                    {t('submit.s4')} <i className='fa fa-caret-right' />
                    </a>
                </>
            )}
            {stage === 'full-editor' && workflow && (
                <>
                    <div>
                        <UploadButton onUpload={setWorkflow} onError={setError} />
                        <Button
                            icon='plus'
                            onClick={() => {
                                services.workflows
                                    .create(workflow, Utils.getNamespaceWithDefault(workflow.metadata.namespace))
                                    .then(onCreate)
                                    .catch(setError);
                            }}>
                            创建
                        </Button>
                    </div>
                    <ErrorNotice error={error} />
                    <WorkflowEditor template={workflow} onChange={setWorkflow} onError={setError} />
                    <div>
                        <ExampleManifests />.
                    </div>
                </>
            )}
        </>
    );
};
