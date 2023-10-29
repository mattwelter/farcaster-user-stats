"use client";

import style from './UserPageComponentNavigation.module.css'

export default function Navigation() {

    return (
        <>
            <div className={`${style['navigation']}`}>
                <nav>
                    <ul>
                        <li><a>Summary</a></li>
                        <li><a>Status Checker</a></li>
                        <li><a>Best Casts</a></li>
                        <li><a>Section 4</a></li>
                        <li><a>Section 5</a></li>
                        <li><a>Section 6</a></li>
                        <li><a>Section 7</a></li>
                    </ul>
                </nav>
            </div>
        </>
    )
}