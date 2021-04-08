using CommercialRegistration;
using ConsumerVehicleRegistration;
using LiveryRegistration;
using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Drawing;
using System.Runtime.CompilerServices;
using toll_calculator;

namespace Playground
{
    public record Person(string Name, int Age)
    {
        public string Name { get; set; } = Name;
        public int Age { get; set; } = Age;
    }

    public class InitDemo
    {
        public string Start { get; init; }
        public string Stop { get; init; }
    }

    class Program
    {
        [ModuleInitializer]
        public static void DoSomethingBeforeMain() => Console.WriteLine("Before main");

        static void Main()
        {
            Func<int, int, int> zero = (_, _) => 0;
            var result = zero(1, 2);
            Console.WriteLine(result);

            [Conditional("DEBUG")]
            static void DoSomething(string test) => Console.WriteLine("Do it!");

            DoSomething("Doing it");
        }

        static void TestRecords()
        {
            var person1 = new Person("Daniel", 26);
            var person2 = new Person("Daniel", 26);

            Console.WriteLine(person1 == person2);
            Console.WriteLine(person1.Equals(person2));

            var person3 = person1 with { Age = 27 };
            Console.WriteLine(person1 == person3);

            var (name, age) = person3;
            Console.WriteLine(name);
            Console.WriteLine(age);
        }

        static void TestPatterns()
        {
            object checkType = new int();
            var getType = checkType switch
            {
                string => "string",
                int => "int",
                _ => "obj"
            };
            Console.WriteLine(getType);

            var person = new Person("Daniel", 27);
            var ageInRange = person switch
            {
                Person(_, < 18) => "less than 18",
                (_, 18) or (_, > 18) => "18 or greater"
            };
            Console.WriteLine(ageInRange);

            var meOrNot = person switch
            {
                not ("Daniel", 27) => "Not me!",
                _ => "it's me =)"
            };
            Console.WriteLine(meOrNot);
        }

        static void TestNativeInts()
        {
            Console.WriteLine($"nint: {nint.MinValue} to {nint.MaxValue}");
            Console.WriteLine($"nuint: {nuint.MinValue} to {nuint.MaxValue}");
        }

        static void TestInitOnly()
        {
            var demo = new InitDemo
            {
                Start = "S1",
                Stop = "S2"
            };

            // Not allowed
            //demo.Start = "S3";

            Console.WriteLine(demo.Start);
        }

        static void TestTargetNewTypes()
        {
            Point p = new(1, 1);
            ConcurrentDictionary<int, int> dict = new();
            Point[] points = { new(1, 1), new(2, 2) };
        }

        static void TollTest()
        {
            var tollCalc = new TollCalculator();

            var soloDriver = new Car();
            var twoRideShare = new Car { Passengers = 1 };
            var threeRideShare = new Car { Passengers = 2 };
            var fullVan = new Car { Passengers = 5 };
            var emptyTaxi = new Taxi();
            var singleFare = new Taxi { Fares = 1 };
            var doubleFare = new Taxi { Fares = 2 };
            var fullVanPool = new Taxi { Fares = 5 };
            var lowOccupantBus = new Bus { Capacity = 90, Riders = 15 };
            var normalBus = new Bus { Capacity = 90, Riders = 75 };
            var fullBus = new Bus { Capacity = 90, Riders = 85 };

            var heavyTruck = new DeliveryTruck { GrossWeightClass = 7500 };
            var truck = new DeliveryTruck { GrossWeightClass = 4000 };
            var lightTruck = new DeliveryTruck { GrossWeightClass = 2500 };

            Console.WriteLine($"The toll for a solo driver is {tollCalc.CalculateToll(soloDriver)}");
            Console.WriteLine($"The toll for a two ride share is {tollCalc.CalculateToll(twoRideShare)}");
            Console.WriteLine($"The toll for a three ride share is {tollCalc.CalculateToll(threeRideShare)}");
            Console.WriteLine($"The toll for a fullVan is {tollCalc.CalculateToll(fullVan)}");

            Console.WriteLine($"The toll for an empty taxi is {tollCalc.CalculateToll(emptyTaxi)}");
            Console.WriteLine($"The toll for a single fare taxi is {tollCalc.CalculateToll(singleFare)}");
            Console.WriteLine($"The toll for a double fare taxi is {tollCalc.CalculateToll(doubleFare)}");
            Console.WriteLine($"The toll for a full van taxi is {tollCalc.CalculateToll(fullVanPool)}");

            Console.WriteLine($"The toll for a low-occupant bus is {tollCalc.CalculateToll(lowOccupantBus)}");
            Console.WriteLine($"The toll for a regular bus is {tollCalc.CalculateToll(normalBus)}");
            Console.WriteLine($"The toll for a bus is {tollCalc.CalculateToll(fullBus)}");

            Console.WriteLine($"The toll for a truck is {tollCalc.CalculateToll(heavyTruck)}");
            Console.WriteLine($"The toll for a truck is {tollCalc.CalculateToll(truck)}");
            Console.WriteLine($"The toll for a truck is {tollCalc.CalculateToll(lightTruck)}");

            try
            {
                tollCalc.CalculateToll("this will fail");
            }
            catch (ArgumentException)
            {
                Console.WriteLine("Caught an argument exception when using the wrong type");
            }
            try
            {
                tollCalc.CalculateToll(null);
            }
            catch (ArgumentNullException)
            {
                Console.WriteLine("Caught an argument exception when using null");
            }

            Console.WriteLine("Testing the time premiums");

            var testTimes = new DateTime[]
            {
                new DateTime(2019, 3, 4, 8, 0, 0), // morning rush
                new DateTime(2019, 3, 6, 11, 30, 0), // daytime
                new DateTime(2019, 3, 7, 17, 15, 0), // evening rush
                new DateTime(2019, 3, 14, 03, 30, 0), // overnight

                new DateTime(2019, 3, 16, 8, 30, 0), // weekend morning rush
                new DateTime(2019, 3, 17, 14, 30, 0), // weekend daytime
                new DateTime(2019, 3, 17, 18, 05, 0), // weekend evening rush
                new DateTime(2019, 3, 16, 01, 30, 0), // weekend overnight
            };

            foreach (var time in testTimes)
            {
                Console.WriteLine($"Inbound premium at {time} is {tollCalc.PeakTimePremium(time, true)}");
                Console.WriteLine($"Outbound premium at {time} is {tollCalc.PeakTimePremium(time, false)}");
            }
        }
    }
}
