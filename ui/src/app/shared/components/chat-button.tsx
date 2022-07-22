import React = require('react');
import {useEffect, useState} from 'react';
import {Link} from '../../../models';
import {services} from '../services';

export const ChatButton = () => {
    const [link, setLink] = useState<Link>();

    useEffect(() => {
        services.info
            .getInfo()
            .then(info => info.links)
            // .then(links => (links || []).concat({name: 'Get help', scope: 'chat', url: 'https://argoproj.github.io/argo-workflows/'}).filter(x => x.scope === 'chat'))
            .then(links => (links || []).concat({name: '更多帮助', scope: 'chat', url: 'https://github.com/Intelligent-Computing-Lab/argoflow/blob/master/argoflow%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.docx'}).filter(x => x.scope === 'chat'))
            .then(links => {
                setLink(links[0]);
            });
    }, []);

    if (!link) {
        return null;
    }

    return (
        <div style={{position: 'fixed', right: 10, bottom: 10}}>
            <a href={link.url} className='argo-button argo-button--special'>
                <i className='fas fa-comment-alt' /> {link.name}
            </a>
        </div>
    );
};
