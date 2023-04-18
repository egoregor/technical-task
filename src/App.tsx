import React, {useEffect, useState} from "react";
import "./App.css";
import GrayHeartIcon from "./assets/gray-heart.svg"
import Comment from "./components/Comment"
import getAuthorsRequest from "./api/authors/getAuthorsRequest"
import {IAuthor} from "./data/authors"
import getCommentsRequest from "./api/comments/getCommentsRequest"
import {IComment} from "./data/comments"
import {getNoun} from "./lib/helpers";

function App() {
    const [authors, setAuthors] = useState<IAuthor[]>([])
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState<boolean>(false)

    useEffect(() => {
        getAuthorsRequest()
            .then(res => {
                setAuthors(res);
                getComments(1)
            })
            .catch(err => {
                console.log(err)
                activateError();
            });
    }, [])

    const getComments = (page: number) => {
        setCommentsLoading(true);
        getCommentsRequest(page)
            .then(res => {
                const filteredData = res.data.sort((a: IComment, b: IComment) => (!a.parent ? (Date.parse(b.created)) - Date.parse(a.created) : a.parent - b.id))
                setComments([...comments, ...filteredData]);
                setPage(page);
                setTotalPages(res.pagination.total_pages)
                setCommentsLoading(false);
            })
            .catch(err => {
                console.log(err)
                setCommentsLoading(false);
                activateError();
            })
    }

    const likeComment = (id: number) => {
        setComments(comments.map((i: IComment) => i.id === id ? {...i, isLiked: !i.isLiked, likes: i.isLiked ? i.likes - 1 : i.likes + 1} : i));
    }

    const activateError = () => {
        document.getElementsByClassName("error")[0].classList.add("errorShow");
        setTimeout(() => {
            document.getElementsByClassName("error")[0].classList.remove("errorShow");
        }, 3000)
    }

    return (
        <div className="app">
            <div className="error">Error. Please, try again.</div>
            {
                comments.length > 0 &&
                <div className="commentsContainer">
                    <div className="commentsHeader">
                        <div className="totalCommentsCount">{comments.length} {getNoun(comments.length, 'комментарий', 'комментария', 'комментариев')}</div>
                        <div className="totalCommentsLikes">
                            <img src={GrayHeartIcon} className="likeImg likeImgTotal" alt=""/>
                            <span>{comments.reduce((sum: number, cur: IComment) => cur.likes + sum, 0)}</span>
                        </div>
                    </div>
                    <ul className="commentsList">
                        {
                            comments.map((comment: IComment) => (
                                <Comment
                                    key={comment.id}
                                    author={authors.find((i: IAuthor) => i.id === comment.author)}
                                    comment={comment}
                                    likeComment={likeComment}
                                />
                            ))
                        }
                    </ul>
                    {
                        page < totalPages &&
                        <button
                            className="btnMore"
                            onClick={() => {getComments(page + 1)}}
                            disabled={commentsLoading}
                        >
                            {
                                commentsLoading ? <span className="loader"></span>
                                    : <span>Загрузить еще</span>
                            }
                        </button>
                    }
                </div>
            }
        </div>
    );
}

export default App;
