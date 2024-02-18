import style from './../styles/Followers.module.css'
import TinyChart from './../utils/TinyChart'

export default async function FollowersSummary(fid: any) {
    const getData = async function(){
        const response = await fetch(`https://farcasteruserstats.com/api/followers?fid=${fid.fid}`);
        if (!response.ok) { throw new Error('Failed to fetch 7 day follower summary'); }
        let data = await response.json()
        return data
    }
    
    const data = await getData()
    console.log({ data })

    return (
        <>
            <h3 className={style['sub-heading']}>{data.length > 0 ? data[0].total_this_week : ""} new followers <a className={`${style['sub-heading-percentage']} ${(data[0] ? data[0].percent_change : 0) < 0 ? style['negative-change'] : style['positive-change']}`}>{(data[0] ? data[0].percent_change : false) ? data[0].percent_change.toFixed(2) : 100}% since last week</a></h3>
            <TinyChart fid={data[0].daily_counts} />
        </>
    )
}