import React, { useEffect, useState } from "react";
import { StyledTodayPage } from "./style";
import dayjs from "dayjs";
import TodayHabitCard from "./TodayHabitCard";
import TrackItResource from "../../common/services/TrackItResource";

export default function TodayPage() {
    const [todayHabitsList, setTodayHabitsList] = useState([]);
    const [concludedHabits, setConcludedHabits] = useState([]);
    const percentageOfConcludedHabits = Math.round(
        (concludedHabits.length / todayHabitsList.length) * 100
    );

    function translateWeekday(date) {
        const weekDays = {
            Sunday: "Domingo",
            Monday: "Segunda",
            Tuesday: "Terça",
            Wednesday: "Quarta",
            Thursday: "Quinta",
            Friday: "Sexta",
            Saturday: "Sábado",
        };

        return weekDays[date.split(",")[0]] + "," + date.split(",")[1];
    }

    async function updateTodayHabits() {
        try {
            const res = await TrackItResource.getTodayHabits();
            setTodayHabitsList(res.data);
            setConcludedHabits(res.data.filter((habit) => habit.done));
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        updateTodayHabits();
    }, []);

    async function toggleHabit(selectedHabit) {
        if (concludedHabits.includes(selectedHabit)) {
            try {
                await TrackItResource.uncheckHabit(selectedHabit.id);
                updateTodayHabits();
            } catch (err) {
                console.log(err);
            }
        } else {
            try {
                await TrackItResource.checkHabit(selectedHabit.id);
                updateTodayHabits();
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <StyledTodayPage>
            <h2>{translateWeekday(dayjs().format("dddd, DD/MM"))}</h2>
            {concludedHabits.length === 0 ? (
                <h3>Nenhum hábito concluído ainda</h3>
            ) : (
                <h3>{percentageOfConcludedHabits}% dos hábitos concluídos</h3>
            )}

            {todayHabitsList.map((habit) => (
                <TodayHabitCard
                    key={habit.id}
                    habit={habit}
                    toggleHabit={toggleHabit}
                />
            ))}
        </StyledTodayPage>
    );
}
