import { MongoClient, ObjectId } from "mongodb";
import { Fragment } from "react";
import Head from "next/head";
import MeetupDetail from "../../components/meetups/MeetupDetail";

// function MeetupDetails(){
//     return (
//         <Fragment>
//             <MeetupDetail 
//                 image='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg'
//                 title='First Meetup'
//                 address='Some Street 5, Some City'
//                 description='This is a first meetup'
//             />
//         </Fragment>
//     )
// }

function MeetupDetails(props) {
  return (
    <Fragment>
            <Head>
              <title>{props.meetupData.title}</title>
              <meta name='description' content={props.meetupData.description} />
            </Head>
            <MeetupDetail
              image={props.meetupData.image}
              title={props.meetupData.title}
              address={props.meetupData.address}
              description={props.meetupData.description}
            />
        </Fragment>
  );
}


//providing Static Data

// export async function getStaticPaths(){
//     //getStaticPaths is required or we get error ,it returns all dynamic values like nextjs wants
//     //to know when to which page is regenerated for which Id and nextjs wont know this by "getStaticProps"
//     //so "getStaticPaths" is used 
//     return{
//         fallback: false, 
//         //fallback checks all the ids have the exact page
//         //if it is "false" means it all(m1,m2) supported,if users enters (m3) it shows 404-error
//         //if it is "true" nextjs tries to generate page with the id dynamically with the missing id
//         paths: [
//             {
//                 params: {
//                     meetupId: 'm1',
//                 }
//             },
//             {
//                 params: {
//                     meetupId: 'm2',
//                 }
//             },
//         ]
//     }
// }


//providing dynamic (API) Data
export async function getStaticPaths(){
    const client = await MongoClient.connect(`mongodb+srv://task:tasks123@cluster0.dsxcn.mongodb.net/meetups?retryWrites=true&w=majority`);
        const db = client.db();

        const meetupsCollection = db.collection('meetups');
        const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();
        client.close();
    return{
        // fallback: false, //"false" gives 404 erroe in production
        fallback: 'blocking', //"blocking"  waits for the page to pregenerate so the 404 erroe will not occur in producion
        paths: meetups.map((meetup) => ({
            params: { meetupId: meetup._id.toString() },
        })),
    }
}

export async function getStaticProps(context){
    // fetch data for a single meetup
    const meetupId = context.params.meetupId; //instead of using useRouter we can use context(only in components not in here so we cant use useRouter)

    const client = await MongoClient.connect(`mongodb+srv://task:tasks123@cluster0.dsxcn.mongodb.net/meetups?retryWrites=true&w=majority`);
        const db = client.db();

        const meetupsCollection = db.collection('meetups');
        const selectedMeetup = await meetupsCollection.findOne({_id: ObjectId(meetupId)});
        client.close();

    console.log(meetupId);

    // return {
    //     props: {
    //     meetupData: {
    //         image:
    //         'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1280px-Stadtbild_M%C3%BCnchen.jpg',
    //         id: meetupId,
    //         title: 'First Meetup',
    //         address: 'Some Street 5, Some City',
    //         description: 'This is a first meetup',
    //     },
    //     },
    // };


    return {
        props: {
          meetupData: {
            id: selectedMeetup._id.toString(),
            title: selectedMeetup.title,
            address: selectedMeetup.address,
            image: selectedMeetup.image,
            description: selectedMeetup.description,
          },
        },
      };
}

export default MeetupDetails;