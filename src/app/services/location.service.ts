import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { TCityGroup } from '../data/location';

function groupByStartingLetter(cities: string[]): TCityGroup[] {
  // Create an empty object to hold the groups
  const groups: { [letter: string]: { letter: string; cities: string[] } } = {};

  // Iterate through each word in the input array
  cities.forEach((city) => {
    // Get the first letter of the word
    const firstLetter = city[0].toUpperCase();

    // Check if the group for this letter already exists
    if (!groups[firstLetter]) {
      // If not, create a new group with this letter
      groups[firstLetter] = { letter: firstLetter, cities: [] };
    }

    // Add the word to the appropriate group
    groups[firstLetter].cities.push(city);
  });

  // Convert the groups object into an array of objects
  return Object.values(groups).sort((a, b) => a.letter.localeCompare(b.letter));
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  url = 'http://localhost:8080/v1/locations';

  private locationsListSubject = new BehaviorSubject<TCityGroup[]>([]);
  locationsList$ = this.locationsListSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getAll().subscribe((locationsList) => {
      this.locationsListSubject.next(locationsList);
    });
  }

  getAll(): Observable<TCityGroup[]> {
    console.log('Get all locations');
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
