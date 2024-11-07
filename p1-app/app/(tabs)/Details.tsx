import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button, TouchableOpacity, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const DescriptionR = () => {
  const [reviews, setReviews] = useState([]);

  return (
    <ImageBackground source={require('../../assets/images/test.png')} style={styles.background} blurRadius={10}>
      <LinearGradient colors={['#FAF0E6', 'transparent']} style={styles.gradient}>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/Logo4.png')}
          style={styles.logo}
        />
      </View>
      <TouchableOpacity style={styles.profileContainer}>
        <Image
          source={require('../../assets/images/avatar.png')}
          style={styles.profile}
        />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.restaurantName}>Restaurant Name</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>This is a description of the restaurant. It provides details about the cuisine, ambiance, and other features that make this restaurant unique.</Text>
        </View>
        <ScrollView horizontal={true} contentContainerStyle={styles.photoContainer} showsHorizontalScrollIndicator={false}>
          <Image
            source={require('../../assets/images/pizza.png')}
            style={styles.photo}
          />
          <Image
            source={require('../../assets/images/pizza.png')}
            style={styles.photo}
          />
          <Image
            source={require('../../assets/images/pizza.png')}
            style={styles.photo}
          />
          <Image
            source={require('../../assets/images/pizza.png')}
            style={styles.photo}
          />
        </ScrollView>
        <View style={styles.latestContainer}>
          <Text style={styles.latestTitle}>Latest Reviews</Text>
          <ScrollView contentContainerStyle={styles.reviewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image
                  source={require('../../assets/images/avatar.png')}
                  style={styles.reviewProfile}
                />
                <Text style={styles.reviewName}>User 1</Text>
                <Text style={styles.reviewStars}>★★★★★</Text>
              </View>
              <Text style={styles.review}>Great food! Everyone needs to go there to get one of the best food.</Text>
              <View style={styles.reviewPhotosContainer}>
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  </View>
            </View>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image
                  source={require('../../assets/images/avatar.png')}
                  style={styles.reviewProfile}
                />
                <Text style={styles.reviewName}>User 2</Text>
                <Text style={styles.reviewStars}>★★★★☆</Text>
              </View>
              <Text style={styles.review}>Excellent service!</Text>
              <View style={styles.reviewPhotosContainer}>
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  </View>
            </View>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image
                  source={require('../../assets/images/avatar.png')}
                  style={styles.reviewProfile}
                />
                <Text style={styles.reviewName}>User 3</Text>
                <Text style={styles.reviewStars}>★★★☆☆</Text>
              </View>
              <Text style={styles.review}>Cozy atmosphere!</Text>
              <View style={styles.reviewPhotosContainer}>
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  <Image
                    source={require('../../assets/images/favicon.png')}
                    style={styles.reviewPhoto}
                  />
                  </View>
                </View>
          </ScrollView>
        </View>
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Add Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
    </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#352F44',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 16,
  },
  restaurantName: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily: 'AmaticSC-Regular',
    color: 'white',
    marginTop: 140,
  },
  descriptionContainer: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  descriptionText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    fontFamily: "Amaticsc-bold",
  },
  logoContainer: {
    position: 'absolute',
    top: 70,
    left: 50,
    zIndex: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  profileContainer: {
    position: 'absolute',
    top: 70,
    right: 50,
    zIndex: 1,
  },
  profile: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  photoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    top: 10,
  },
  photo: {
    width: 100,
    height: 100,
    margin: 8,
  },
  latestContainer: {
    width: '100%',
    height: 330,
    padding: 30,
    marginTop: 20,
    backgroundColor: '#FAF0E6',
    borderRadius: 10,
    alignItems: 'center',
    bottom: 10,
  },
  latestTitle: {
    fontSize: 20,
    color: 'black',
    marginBottom: 10,
    fontFamily: 'SpaceMono-Regular',
  },
  reviewContainer: {
    width: '100%',
    padding: 10,
  },
  reviewItem: {
    marginBottom: 20,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  reviewProfile: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: "Poppins-Bold",
  },
  reviewStars: {
    fontSize: 16,
    color: '#FFD700', // Gold color for stars
  },
  review: {
    fontSize: 15,
    color: 'black',
    fontFamily: "poppins-regular",
  },
  reviewPhotosContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reviewPhoto: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonContainer: {
    width: 234.29,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#FAF0E6",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#0C0C0C",
    fontSize: 20,
    fontFamily: "SpaceMono-Regular",
  },
});

export default DescriptionR;