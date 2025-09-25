package com.example.flink;

import org.apache.flink.api.common.eventtime.WatermarkStrategy;
import org.apache.flink.api.common.functions.MapFunction;
import org.apache.flink.api.common.serialization.SimpleStringSchema;
import org.apache.flink.streaming.api.datastream.DataStream;
import org.apache.flink.streaming.api.environment.StreamExecutionEnvironment;
import org.apache.flink.streaming.api.functions.source.SourceFunction;
import org.apache.flink.streaming.api.windowing.assigners.SlidingProcessingTimeWindows;
import org.apache.flink.streaming.api.windowing.time.Time;

import java.util.Random;

public class SensorDataStream {

    public static class SensorReading {
        public String id;
        public long timestamp;
        public double temperature;

        public SensorReading() {}

        public SensorReading(String id, long timestamp, double temperature) {
            this.id = id;
            this.timestamp = timestamp;
            this.temperature = temperature;
        }

        @Override
        public String toString() {
            return "SensorReading{" +
                    "id='" + id + '\'' +
                    ", timestamp=" + timestamp +
                    ", temperature=" + temperature +
                    '}';
        }
    }

    public static class SensorSource implements SourceFunction<SensorReading> {
        private boolean running = true;
        private Random rand = new Random();

        @Override
        public void run(SourceContext<SensorReading> ctx) throws Exception {
            String[] sensorIds = {"sensor_1", "sensor_2", "sensor_3", "sensor_4", "sensor_5"};
            double[] baseTemperatures = {20.0, 21.5, 19.0, 22.0, 20.5};

            while (running) {
                for (int i = 0; i < sensorIds.length; i++) {
                    double temperature = baseTemperatures[i] + (rand.nextGaussian() * 2);
                    ctx.collect(new SensorReading(
                        sensorIds[i],
                        System.currentTimeMillis(),
                        temperature
                    ));
                }
                Thread.sleep(1000);
            }
        }

        @Override
        public void cancel() {
            running = false;
        }
    }

    public static void main(String[] args) throws Exception {

        final StreamExecutionEnvironment env = StreamExecutionEnvironment.getExecutionEnvironment();

        env.setParallelism(2);

        DataStream<SensorReading> sensorData = env.addSource(new SensorSource());

        DataStream<SensorReading> fahrenheit = sensorData
            .map(new MapFunction<SensorReading, SensorReading>() {
                @Override
                public SensorReading map(SensorReading reading) throws Exception {
                    reading.temperature = reading.temperature * 1.8 + 32;
                    return reading;
                }
            });

        DataStream<SensorReading> averageTemp = fahrenheit
            .keyBy(reading -> reading.id)
            .window(SlidingProcessingTimeWindows.of(Time.seconds(10), Time.seconds(5)))
            .reduce((r1, r2) -> {
                return new SensorReading(
                    r1.id,
                    System.currentTimeMillis(),
                    (r1.temperature + r2.temperature) / 2
                );
            });

        DataStream<SensorReading> alertStream = fahrenheit
            .filter(reading -> reading.temperature > 80.0);

        sensorData.print("Raw Sensor Data");
        averageTemp.print("Average Temperature");
        alertStream.print("High Temperature Alert");

        env.execute("Sensor Data Processing");
    }
}