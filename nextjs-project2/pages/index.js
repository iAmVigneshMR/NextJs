// import { useEffect, useState } from "react";
import { MongoClient } from "mongodb";
import Head from 'next/head';
import { Fragment } from "react";
import MeetupList from "../components/meetups/MeetupList";

// const DUMMY_MEETUPS = [
//     {
//         id: 'm1',
//         title: 'A First Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 5, 12345 Some City',
//         description: 'This is a first meetup!'
//       },
//       {
//         id: 'm2',
//         title: 'A Second Meetup',
//         image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
//         address: 'Some address 10, 12345 Some City',
//         description: 'This is a second meetup!'
//       }
// ]

function HomePage(props){
    // const [loadedMeetups, setLoadedMeetups] = useState([]);
    
    // useEffect(() => {
    //     setLoadedMeetups(DUMMY_MEETUPS);
    // })
    // return <MeetupList meetups={loadedMeetups} />
    return (
        <Fragment>
            <Head>
                <title>React Meetups</title>
                <meta name="description" content="Browse a huge list of highly React Meetups" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    )
}



// nextjs has 2 renderening phases (1.pre-rendering,2.post-rendering) so useEffect does not render when page loads
// as useEffect falls into 2nd phase, nextjs does not wait for 2nd phase
//we can tell nextjs wait for datat to load (or) to render in 1st phade(pre-render) by 2 ways
//1.static generation , 2.server-side-rendering

//imp : static generation is better than server-side-rendering
//in getStaticProps html page is created and stored and can be served pages will be faster
//only use getServerSideProps only when we need req and res


//1st way (static generation)

export async function getStaticProps(){ 
    //fetch data from an api
    //getStaticProps only works inside "pages folder"
    //will not be executed on client-side ,not on server-side ,only executed during the build process
    
    const client = await MongoClient.connect(`mongodb+srv://task:tasks123@cluster0.dsxcn.mongodb.net/meetups?retryWrites=true&w=majority`);
        const db = client.db();

        const meetupsCollection = db.collection('meetups');
        const meetups = await meetupsCollection.find().toArray();
        client.close();

    return{
        props: {
            meetups: meetups.map(meetup => ({
                title: meetup.title,
                address: meetup.address,
                image: meetup.image,
                id: meetup._id.toString(),
            }))
        },
        revalidate: 1,  //waits for sometime after every couple of seconds if only requested br client
    }
}



//2nd way (server-side-rendering)

// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;

//     //not run during build process and only run on server after deployment
//     //fetch data from an api
//     return{
//         props: {
//             meetups: DUMMY_MEETUPS
//         }
//     }
// }

export default HomePage;

