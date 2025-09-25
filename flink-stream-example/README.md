# Flink Stream Example

Basic Apache Flink streaming application examples demonstrating core streaming concepts.

## Examples Included

### 1. WordCountStream.java
- Reads text from a socket (localhost:9999)
- Counts words in 5-second tumbling windows
- Demonstrates: FlatMap, KeyBy, Window, and Sum operations

### 2. SensorDataStream.java
- Generates simulated sensor readings
- Converts temperatures from Celsius to Fahrenheit
- Calculates sliding window averages (10-second window, 5-second slide)
- Filters high temperature alerts (>80°F)
- Demonstrates: Custom sources, Map, Filter, Reduce, and multiple streams

## Prerequisites
- Java 11 or higher
- Maven 3.6+

## Building the Project
```bash
cd flink-stream-example
mvn clean package
```

## Running the Examples

### Word Count Stream
1. Start a netcat server to provide input:
```bash
nc -lk 9999
```

2. Run the application:
```bash
mvn exec:java -Dexec.mainClass="com.example.flink.WordCountStream"
```

3. Type text into the netcat terminal and see word counts in the Flink output

### Sensor Data Stream
Run the application:
```bash
mvn exec:java -Dexec.mainClass="com.example.flink.SensorDataStream"
```

## Key Flink Concepts Demonstrated

- **DataStream API**: Core streaming abstraction
- **Sources**: Socket source and custom source function
- **Transformations**: Map, FlatMap, Filter, Reduce
- **Windowing**: Tumbling and Sliding windows
- **KeyBy**: Stream partitioning for stateful operations
- **Parallelism**: Configurable task parallelism

## Project Structure
```
flink-stream-example/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── example/
                    └── flink/
                        ├── WordCountStream.java
                        └── SensorDataStream.java
```