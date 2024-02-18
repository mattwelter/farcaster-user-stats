"use client"

import React, { Suspense, useState, lazy } from 'react';
import style from './UserPage.module.css'
import tabStyle from './UserPageTabs.module.css'
import CastsLoading from '../../components/loading/Casts-Loading'

// Lazy-load components for each tab
const Followers = lazy(() => import('../../components/Followers'));
const Cast = lazy(() => import('../../components/Casts'));
const Activity = lazy(() => import('../../components/CastActivity'));
const ActiveBadgeCheck = lazy(() => import('../../components/ActiveBadgeCheck'));
const Casts = lazy(() => import('../../components/MostLikedCasts'));
const Unfollowers = lazy(() => import('../../components/Unfollowers'));
const DailyStats = lazy(() => import('../../components/DailyStats'));

export default function Body({ fid, user }: { fid: any, user: any }) {
    const [tab, setTab] = useState(1);

    return (
        <>
            {/* Navigation Tabs */}
            <div className={`${style['section-padding']} ${"width-500"}`}>
                <div className={`${tabStyle['navigation']}`}>
                    <nav>
                        <ul>
                            <li><a className={tab == 1 ? tabStyle['selected-tab'] : ""} onClick={(e) => setTab(2)}><svg fill="none" height="19" viewBox="0 0 16 19" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m8.00744 18.9115c-.07738 0-.17411-.0162-.29018-.0484-.10962-.0322-.22247-.0806-.33854-.1451-1.30903-.7287-2.41493-1.3767-3.31771-1.9442-.89633-.561-1.61855-1.1091-2.16667-1.6443-.54811-.5353-.947912-1.1124-1.1994-1.7314-.245039-.6191-.367559-1.3445-.367559-2.1764v-6.96426c0-.51587.106399-.88988.319196-1.12202.219246-.23215.535223-.43527.947913-.60938.26439-.10962.64807-.25793 1.15105-.44494.50297-.19345 1.04464-.39658 1.625-.60937.58035-.2128 1.12202-.40625 1.625-.58036.50297-.180556.88665-.3063 1.15104-.377232.12897-.038691.26761-.074157.41592-.106399.14831-.03869.29663-.058036.44494-.058036.14186 0 .28695.016121.43527.048363.14831.025794.29018.064485.42559.116072.25794.083829.6384.216022 1.1414.396577.5094.174105 1.0511.367555 1.625.580355.5803.20635 1.122.40303 1.625.59003.5094.18701.8931.33532 1.151.44494.4256.18056.7416.38691.9479.61905.2128.22569.3192.59648.3192 1.11235v6.96426c0 .8319-.1257 1.5605-.3772 2.186-.245.6191-.6416 1.1962-1.1897 1.7314-.5417.5353-1.2639 1.0834-2.1667 1.6444-.8963.5674-1.99901 1.2123-3.30804 1.9345-.11607.0645-.23214.1129-.34821.1451-.10963.0322-.20313.0484-.28051.0484zm0-1.8088c.07093 0 .14509-.0161.22247-.0484.07738-.0258.18378-.0774.3192-.1547 1.04464-.6384 1.92159-1.1833 2.63099-1.6347.7093-.4579 1.2767-.8899 1.7023-1.2961.4256-.4063.7287-.8512.9093-1.3349.187-.4836.2805-1.0704.2805-1.7604v-6.32588c0-.16121-.0194-.28051-.0581-.35789s-.1225-.14186-.2515-.19345c-.2772-.09673-.5997-.20957-.9672-.33854-.3611-.12897-.7416-.26439-1.1414-.40625-.3933-.14187-.7899-.28373-1.1897-.4256-.3934-.14831-.76738-.28695-1.12204-.41592-.34821-.13542-.65451-.25471-.9189-.35789-.08383-.03224-.16121-.05481-.23214-.0677-.07093-.01935-.13219-.02902-.18378-.02902-.05804 0-.12252.00967-.19345.02902-.06449.01289-.14187.03546-.23215.0677-.25793.10318-.56423.21925-.91889.34822-.34822.12897-.72223.26438-1.12203.40625-.3998.13542-.80283.27406-1.20908.41592-.3998.14187-.78025.28051-1.14136.41592-.35467.13542-.67064.25472-.94792.35789-.12897.05159-.2128.11607-.25149.19345s-.05803.19668-.05803.35789v6.32588c0 .69.09027 1.2736.27083 1.7508.187.4771.49008.9221.90922 1.3348.4256.4062.99306.8383 1.70239 1.2961.70932.4578 1.58953 1.006 2.64062 1.6444.13542.0773.24182.1289.3192.1547.08383.0323.16121.0484.23214.0484zm-.99628-3.5886c-.16121 0-.3063-.0354-.43527-.1064-.12897-.0709-.25471-.187-.37723-.3482l-2.19568-2.6793c-.14832-.1934-.22247-.39334-.22247-.59969 0-.2128.07093-.39336.21279-.54167.14832-.14831.32887-.22247.54167-.22247.13542 0 .25794.02579.36756.07738s.21925.14831.32887.29018l1.75074 2.24407 3.69496-5.92934c.187-.29018.4159-.43527.6867-.43527.1999 0 .3805.06449.5417.19346.1612.12896.2418.29985.2418.51264 0 .10963-.0225.21603-.0677.3192-.0451.10318-.0967.1999-.1547.29018l-4.13993 6.48063c-.187.3031-.44494.4546-.77381.4546z" fill="#a6a4ab"/></svg> Status Checker</a></li>
                            <li><a className={tab == 2 ? tabStyle['selected-tab'] : ""} onClick={(e) => setTab(1)}><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.93676 16.6347C1.43378 16.6347 1.04043 16.5218 0.756696 16.2961C0.472966 16.0769 0.331101 15.7738 0.331101 15.3869C0.331101 14.7937 0.508432 14.1746 0.863095 13.5298C1.22421 12.8785 1.74008 12.2691 2.41071 11.7016C3.08135 11.1342 3.89062 10.6731 4.83854 10.3185C5.79291 9.95734 6.86334 9.77679 8.04985 9.77679C9.23636 9.77679 10.3036 9.95734 11.2515 10.3185C12.1994 10.6731 13.0087 11.1342 13.6793 11.7016C14.3564 12.2691 14.8723 12.8785 15.2269 13.5298C15.5816 14.1746 15.7589 14.7937 15.7589 15.3869C15.7589 15.7738 15.6171 16.0769 15.3333 16.2961C15.0496 16.5218 14.6595 16.6347 14.1629 16.6347H1.93676ZM8.05952 8.15179C7.39534 8.15179 6.78274 7.97445 6.22173 7.61979C5.66716 7.25868 5.22222 6.77183 4.8869 6.15923C4.55159 5.54663 4.38393 4.8631 4.38393 4.10863C4.38393 3.36062 4.55159 2.68998 4.8869 2.09673C5.22222 1.49702 5.67039 1.02307 6.2314 0.674852C6.79241 0.320189 7.40179 0.142858 8.05952 0.142858C8.71726 0.142858 9.32341 0.316965 9.87798 0.665179C10.4325 1.00695 10.8775 1.47768 11.2128 2.07738C11.5546 2.67064 11.7254 3.34127 11.7254 4.08929C11.7254 4.8502 11.5546 5.54018 11.2128 6.15923C10.8775 6.77183 10.4325 7.25868 9.87798 7.61979C9.32341 7.97445 8.71726 8.15179 8.05952 8.15179Z" fill="#a6a4ab"/> </svg> Summary</a></li>
                            <li><a className={tab == 3 ? tabStyle['selected-tab'] : ""} onClick={(e) => setTab(3)}><svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.331101 3.37128C0.331101 2.8812 0.47619 2.49752 0.766369 2.22024C1.063 1.93651 1.46602 1.79464 1.97545 1.79464H3.72619C3.81647 1.31746 4.02927 0.946678 4.36458 0.682293C4.6999 0.411459 5.14807 0.276043 5.70908 0.276043H13.0796C13.6406 0.276043 14.0888 0.411459 14.4241 0.682293C14.7659 0.953126 14.9754 1.32391 15.0528 1.79464H16.8132C17.3291 1.79464 17.7289 1.93651 18.0126 2.22024C18.3028 2.49752 18.4479 2.8812 18.4479 3.37128C18.4479 4.62227 18.2448 5.72173 17.8385 6.66964C17.4387 7.61756 16.8358 8.42039 16.0298 9.07813C15.2237 9.73586 14.2145 10.2517 13.0022 10.6257C12.7701 10.9288 12.5186 11.2029 12.2478 11.4479C11.9834 11.693 11.7222 11.9025 11.4643 12.0766V15.8876H12.5573C13.2086 15.8876 13.7051 16.065 14.0469 16.4196C14.3886 16.7743 14.5595 17.2579 14.5595 17.8705V19.7374C14.5595 19.963 14.4821 20.1436 14.3274 20.279C14.1791 20.4209 13.9985 20.4918 13.7857 20.4918H5.00298C4.79663 20.4918 4.61607 20.4209 4.46131 20.279C4.30655 20.1436 4.22917 19.963 4.22917 19.7374V17.8705C4.22917 17.2579 4.39683 16.7743 4.73214 16.4196C5.07391 16.065 5.57044 15.8876 6.22173 15.8876H7.31473V12.067C7.0568 11.8929 6.79563 11.6865 6.53125 11.4479C6.27331 11.2029 6.02505 10.9288 5.78646 10.6257C4.57416 10.2517 3.56498 9.73586 2.75893 9.07813C1.95288 8.42039 1.34673 7.61756 0.940476 6.66964C0.534226 5.72173 0.331101 4.62227 0.331101 3.37128ZM1.75298 3.55506C1.75298 4.78026 1.98834 5.82168 2.45908 6.67932C2.93626 7.53051 3.62946 8.19147 4.53869 8.6622C4.27431 8.13343 4.06151 7.56275 3.9003 6.95015C3.74554 6.33755 3.66815 5.69916 3.66815 5.03497V3.2939H2.02381C1.94643 3.2939 1.88194 3.31969 1.83036 3.37128C1.77877 3.41642 1.75298 3.47768 1.75298 3.55506ZM5.19643 5.28646C5.19643 5.9313 5.2996 6.5568 5.50595 7.16295C5.7123 7.76265 5.97991 8.32044 6.30878 8.83631C6.6441 9.34573 7.00198 9.79068 7.38244 10.1711C7.7629 10.5516 8.13046 10.8514 8.48512 11.0707C8.84623 11.2835 9.1493 11.3899 9.39434 11.3899C9.63938 11.3899 9.93924 11.2835 10.2939 11.0707C10.6486 10.8514 11.0161 10.5516 11.3966 10.1711C11.7835 9.79068 12.1414 9.34573 12.4702 8.83631C12.8056 8.32044 13.0764 7.76265 13.2827 7.16295C13.4891 6.5568 13.5923 5.9313 13.5923 5.28646V2.35566C13.5923 2.19445 13.5407 2.06225 13.4375 1.95908C13.3408 1.8559 13.2086 1.80432 13.0409 1.80432H5.74777C5.58656 1.80432 5.45436 1.8559 5.35119 1.95908C5.24802 2.06225 5.19643 2.19445 5.19643 2.35566V5.28646ZM5.74777 18.9732H13.0312V17.9479C13.0312 17.7803 12.9797 17.6481 12.8765 17.5513C12.7798 17.4546 12.6508 17.4062 12.4896 17.4062H6.29911C6.13145 17.4062 5.99603 17.4546 5.89286 17.5513C5.79613 17.6481 5.74777 17.7803 5.74777 17.9479V18.9732ZM8.80431 15.8876H9.98437V12.8118C9.77803 12.8698 9.58135 12.8988 9.39434 12.8988C9.20734 12.8988 9.01066 12.8698 8.80431 12.8118V15.8876ZM14.25 8.6622C15.1592 8.19147 15.8492 7.53051 16.3199 6.67932C16.7907 5.82168 17.026 4.78026 17.026 3.55506C17.026 3.47768 17.0035 3.41642 16.9583 3.37128C16.9132 3.31969 16.8519 3.2939 16.7746 3.2939H15.1205V5.03497C15.1205 5.69916 15.0399 6.33755 14.8787 6.95015C14.724 7.56275 14.5144 8.13343 14.25 8.6622Z" fill="#a6a4ab"/></svg> Best Casts</a></li>
                            <li><a className={tab == 4 ? tabStyle['selected-tab'] : ""} onClick={(e) => setTab(4)}><svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.6295 18.186L0.741071 1.29762C0.599206 1.1622 0.528274 0.994545 0.528274 0.794644C0.528274 0.588295 0.599206 0.417412 0.741071 0.281995C0.882936 0.14013 1.05382 0.0724216 1.25372 0.07887C1.45362 0.07887 1.62128 0.146578 1.7567 0.281995L18.6354 17.1607C18.7837 17.3026 18.8547 17.4702 18.8482 17.6637C18.8482 17.8636 18.7773 18.0345 18.6354 18.1763C18.5064 18.3182 18.342 18.3891 18.1421 18.3891C17.9422 18.3956 17.7713 18.3279 17.6295 18.186ZM9.35937 2.37128C8.8693 2.37128 8.42435 2.51959 8.02455 2.81622C7.6312 3.11285 7.34102 3.5062 7.15402 3.99628L6.01265 2.84524C6.36731 2.25198 6.83805 1.77803 7.42485 1.42336C8.01166 1.06225 8.6565 0.881697 9.35937 0.881697C10.0945 0.881697 10.7619 1.0687 11.3616 1.44271C11.9678 1.81672 12.4482 2.32292 12.8028 2.96131C13.1639 3.5997 13.3445 4.30903 13.3445 5.08929C13.3445 5.79861 13.1962 6.45635 12.8996 7.0625C12.6029 7.66865 12.2096 8.1684 11.7195 8.56176L10.6362 7.47842C10.9779 7.23338 11.252 6.90129 11.4583 6.48214C11.6647 6.063 11.7679 5.59871 11.7679 5.08929C11.7679 4.57341 11.6582 4.11235 11.439 3.7061C11.2197 3.2934 10.9296 2.96776 10.5685 2.72917C10.2073 2.49058 9.80431 2.37128 9.35937 2.37128ZM14.1763 16.4159L15.6466 17.8765C15.5499 17.8829 15.4563 17.8894 15.3661 17.8958C15.2758 17.9023 15.1791 17.9055 15.0759 17.9055H3.63318C2.09846 17.9055 1.3311 17.3993 1.3311 16.3869C1.3311 15.8194 1.49231 15.2197 1.81473 14.5878C2.13715 13.9559 2.60144 13.3562 3.20759 12.7887C3.81374 12.2148 4.54886 11.7279 5.41295 11.3281C6.27703 10.9283 7.25074 10.6801 8.33408 10.5833L9.7753 12.0149C9.70436 12.0084 9.63343 12.0052 9.5625 12.0052C9.49157 12.0052 9.42386 12.0052 9.35937 12.0052C8.32763 12.0052 7.41518 12.1503 6.62202 12.4405C5.82887 12.7307 5.15823 13.0982 4.61012 13.5432C4.062 13.9881 3.64608 14.4459 3.36235 14.9167C3.08507 15.3874 2.94643 15.8065 2.94643 16.1741C2.94643 16.2579 2.97222 16.3192 3.02381 16.3579C3.0754 16.3966 3.156 16.4159 3.26562 16.4159H14.1763Z" fill="#a6a4ab"/></svg>Unfollowers</a></li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Tab Panels */}
            <div className={`${style['section-padding']} ${"width-500"}`}>
                {tab === 1 && (
                    <>
                        <div>
                            <h3 className="activestatus-title">Active Status</h3>
                            <Suspense fallback={<a className={`${style['rank-loading']}`}>Loading...</a>}>
                                <ActiveBadgeCheck userObject={user} />
                            </Suspense>
                        </div>
                    </>
                )}
                {tab === 2 && (
                    <>
                        <div>
                            <h3 className="week-summary-title">7 day summary</h3>
                            <Suspense fallback={<a className={`${style['rank-loading']}`}>Loading...</a>}>
                                <Followers fid={fid}/>
                            </Suspense>
                            <Suspense fallback={<a className={`${style['rank-loading']}`}>Loading...</a>}>
                                <Cast fid={fid}/>
                            </Suspense>
                        </div>
                        <div>
                            <h3 className="castactivity-title">Cast Activity</h3>
                            <Suspense fallback={<a className={`${style['rank-loading']}`}>Loading...</a>}>
                                <Activity fid={fid} />
                            </Suspense>
                        </div>
                        <div>
                            <h3 className="mostlikedcasts-title">Daily Followers</h3>
                            <Suspense fallback={<a className={`${style['rank-loading']}`}>Loading...</a>}>
                                <DailyStats fid={fid}/>
                            </Suspense>
                        </div>
                    </>
                )}
                {tab === 3 && (
                    <>
                        <div>
                            <h3 className="mostlikedcasts-title">Most Liked Casts (all time)</h3>
                            <Suspense fallback={<CastsLoading />}>
                                <Casts fid={fid} username={user.username}/>
                            </Suspense>
                        </div>
                    </>
                )}
                {tab === 4 && (
                    <>
                        <div>
                            <h3 className="mostlikedcasts-title">Recently Unfollowed By</h3>
                            <Suspense fallback={<CastsLoading />}>
                                <Unfollowers fid={fid} username={user.username}/>
                            </Suspense>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}