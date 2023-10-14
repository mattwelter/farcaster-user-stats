import style from '../MostLikedCasts.module.css'

export default async function UserFeed() {

    let casts = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ]

    return (
        <>
        <div className={style.castsloading}>
        {casts.map((cast: any) => (
            <section className={style.castloading}>

            </section>
            ))}
        </div>
        </>
    )
}