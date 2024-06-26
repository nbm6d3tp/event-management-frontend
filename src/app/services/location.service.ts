import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

function groupByStartingLetter(words: string[]) {
  // Create an empty object to hold the groups
  const groups: { [letter: string]: { letter: string; names: string[] } } = {};

  // Iterate through each word in the input array
  words.forEach((word) => {
    // Get the first letter of the word
    const firstLetter = word[0].toLowerCase();

    // Check if the group for this letter already exists
    if (!groups[firstLetter]) {
      // If not, create a new group with this letter
      groups[firstLetter] = { letter: firstLetter, names: [] };
    }

    // Add the word to the appropriate group
    groups[firstLetter].names.push(word);
  });

  // Convert the groups object into an array of objects
  return Object.values(groups);
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  url = 'http://localhost:8080/v1/locations/';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http
      .get<
        {
          idCity: string;
          name: string;
        }[]
      >(this.url)
      .pipe(
        map((cities) => groupByStartingLetter(cities.map((city) => city.name)))
      );
  }
}
