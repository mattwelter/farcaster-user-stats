import style from './styles/CastActivity.module.css'
import Tooltip from '../utils/Tooltip';

export default async function HomeFeed(fid: any) {

  // width: 600px;
  //   260 = Sunday
  //   260 = Monday
  //   261 = Tuesday
  //   262 = Wednesday
  //   263 = Thursday
  //   264 = Friday
  //   265 = Saturday

  // width: 375px;
  //   168 = Sunday
  //   169 = Monday
  //   170 = Tuesday
  //   171 = Wednesday
  //   172 = Thursday
  //   173 = Friday
  //   174 = Saturday

  let getDay = new Date().getDay()
  var day = 0
  switch (getDay) {
    case 0: // Sunday
      var day = 168
      break;
    case 1: // Monday
      var day = 169
      break;
    case 2: // Tuesday
      var day = 170
      break;
    case 3: // Wednesday
      var day = 171
      break;
    case 4: // Thursday
      var day = 172
      break;
    case 5: // Friday
      var day = 173
      break;
    case 6: // Saturday
      var day = 174
      break;
    default:
      var day = 171 // Wednesday default
  }
  
  const getData = async function(){
    const response = await fetch(`https://farcasteruserstats.com/api/cast-activity?fid=${fid.fid}&day=${day}`);
    if (!response.ok) { throw new Error('Failed to fetch daily stats'); }
    let data = await response.json()
    return data
  }

  const data = await getData()

  return (
    <>
        <div className={style['cast-activity-wrapper']}>
            <div className={style['cast-activity']}>
                {data.length != 0 ? data.map((event: any) => (
                    <Tooltip content={ event.castamount + " casts - " + (new Date(event.date).getMonth() + 1) + "/" + new Date(event.date).getDate() + "/" + new Date(event.date).getFullYear() }>
                        <a className={ parseInt(event.castamount) == 0 ? style['cast-color-0'] : (parseInt(event.castamount) <= 4 ? style['cast-color-2'] : parseInt(event.castamount) <= 8 ? style['cast-color-4'] : parseInt(event.castamount) <= 12 ? style['cast-color-6'] : style['cast-color-8']) }></a>
                    </Tooltip>
                ))
                : <a>Nothing here...</a>
                }
            </div>
        </div>
    </>
    )
}