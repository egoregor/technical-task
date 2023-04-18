import React from "react";
import HeartIcon from "../assets/heart.svg"
import FullHeartIcon from "../assets/full-heart.svg"
import {IAuthor} from "../data/authors"
import {IComment} from "../data/comments"
import {getTime, getNoun} from "../lib/helpers"
import Moment from 'react-moment';

interface IProps {
    author: IAuthor | undefined,
    comment: IComment,
    likeComment: (id: number) => void
}

function Comment({author, comment, likeComment}: IProps) {
    return (
        <li className={`comment ${comment.parent ? "subComment" : ''}`}>
            <div className="commentHeader">
                <div className="commentAvatar" style={{backgroundImage: `url(${author?.avatar})`}} />
                <div className="commentInfo">
                    <div className="commentNick">{author?.name}</div>
                    <div className="commentTime">
                        {
                            getTime(comment.created) < 24 ?
                                <span>{`${getTime(comment.created)} ${getNoun(getTime(comment.created), 'час', 'часа', 'часов')} назад`}</span> :
                                <Moment format="DD.MM.YYYY hh:mm:ss">
                                    {comment.created}
                                </Moment>
                        }
                    </div>
                </div>
                <div className="commentLike">
                    <img
                        src={comment.isLiked ? FullHeartIcon : HeartIcon}
                        className="likeImg"
                        onClick={() => {likeComment(comment.id)}}
                        alt=""
                    />
                    <span>{comment.likes}</span>
                </div>
            </div>
            <div className="commentText">
                {comment.text}
            </div>
        </li>
    );
}

export default Comment;
