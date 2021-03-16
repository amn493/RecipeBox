import './Feed.css'
import LargeRecipePreview from './LargeRecipePreview'

// Pulls the respective amount of images for a feed and loads them on to the page
const Feed = (props) => {

    // Pull 10 recipes from the database that would go in feed
    let feedEntries = [0, 1, 2, 3]
    // TODO: Back-end task -- Fill feedEntries. Also need to adjust below so the array contains both "recipe" and "likes"
    // Whether or not we bring things into the array or just take an external array, this is here for now for loop functionality

    return (
        <div className="feed-body container">
            {feedEntries.map((entry, index) => (
                // Recipe will be entry[0], likes will be entry[1] (or just entry.recipe and entry.likes when the api is up)
                <div className="feed-entry">
                <LargeRecipePreview key={index} recipe={{imagePath: 'logo192.png', slug: 'foobarguacamole', name: 'Guacamole', user: {username: 'foobar'}, likes: 36, createdAt: '2 days ago', caption: 'Because who doesn\'t love guac?', tags: ['mexican', 'spicy', 'dip']}} liked={false}></LargeRecipePreview>
                </div>
            ))}
        </div>
    )
}

export default Feed