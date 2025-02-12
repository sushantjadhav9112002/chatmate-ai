import './chatPage.css';
import { React, useEffect } from 'react';
import NewPrompt from '../../components1/newprompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { IKImage } from 'imagekitio-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

const chatPage = () => {
    const path = useLocation().pathname;
    const chatId = path.split('/').pop();

    const { isPending, error, data } = useQuery({
        queryKey: ['chat', chatId],
        queryFn: () =>
            fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
                credentials: "include",
            }).then((res) => res.json()),
    });

    return (
        <div className='chatpage'>
            <div className="wrapper">
                <div className="chat">
                    {isPending ? "Loading..." : error ? "Something went wrong" : data?.history?.map((message, i) => (
                        <>
                            {message.img && (
                                <IKImage
                                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                    path={message.img}
                                    height="300"
                                    width="400"
                                    transformation={[{ height: 300, width: 400 }]}
                                    loading='lazy'
                                    lqip={{ active: true, quality: 20 }}
                                />
                            )}
                            <div className={message.role === "user" ? "message user" : "message"} key={i}>
                                <ReactMarkdown 
                                    children={message.parts[0]?.text || ""}
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeHighlight]}
                                />
                            </div>
                        </>
                    ))}

                    {data && <NewPrompt data={data} />}
                </div>
            </div>
        </div>
    );
};

export default chatPage;
