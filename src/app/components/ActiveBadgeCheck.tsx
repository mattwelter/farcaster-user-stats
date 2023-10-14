
export default async function HomeFeed(userObject: any) {

    let user = userObject.userObject

    const activeBadge = {
        active: user.activeStatus == "active" ? true : false,
        completeProfile: user.displayName && user.profile.bio.text && user.pfp.url ? true : false,
        profile: {
            name: user.displayName ? true : false,
            bio: user.profile.bio.text ? true : false,
            pfp: user.pfp.url ? true : false,
        },
        followers: user.followerCount >= 100 ? true : false,
    }

    console.log(activeBadge)

    return (
        <>
            <div>

            </div>
        </>
        )
    }