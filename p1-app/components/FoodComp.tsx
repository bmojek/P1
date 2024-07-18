// import React from 'react';
// import { View, Text, Image, StyleSheet } from 'react-native';
// import {BlurView} from 'expo-blur';

// type FoodCardProps = {
//   name: string;
//   image: any;
//   rating: number;
//   reviewCount: number;
//   type: string;
//   location: string;
// };

// const FoodCard: React.FC<FoodCardProps> = ({ name,image }) => {
//   return (
//     <View style={styles.outerContainer}>
//     <BlurView intensity={50} tint="light" style={styles.cardContainer}>
//       <Image source={image} style={styles.foodImage} />
//       <Text style={styles.foodName}>{name}</Text>
//     </BlurView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     outerContainer: {
//         marginRight: 10,
//         borderRadius: 15, // Adjust border radius as needed
//         overflow: 'hidden',
//       },
//     cardContainer: { 
//         borderRadius: 15,
//         padding: 10,
//         alignItems: 'center',
//         width: 150,
//       },
//       foodImage: {
//         width: 50,
//         height: 50,
//         marginBottom: 10,
//       },
//       foodName: {
//         fontSize: 18,
//         color: '#000',
//         fontWeight: 'bold',
//       },
//     });

// export default FoodCard;