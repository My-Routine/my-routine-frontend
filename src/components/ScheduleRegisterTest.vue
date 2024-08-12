<script setup>
import { ref } from 'vue';

const props = defineProps({
	workTime: {
		type: Object,
		required: false,
		default: {
			title: String,
			startAt: String,
			endAt: String
		}
	}
})
const handleSubmit = () => {
	const scheduleData = {
		title: props.workTime.title,
		startTime: props.workTime.startAt,
		endTime: props.workTime.endAt
	};
	
};
</script>

<template>
	<div class="form-container">
		<h2>일정 등록</h2>
		<form @submit.prevent="handleSubmit">
			<div class="form-group">
				<label for="title">일정 이름:</label>
				<input type="text" v-model="workTime.title" id="title" class="form-control" required />
			</div>
			<div class="form-group">
				<label for="startTime">시작시간:</label>
				<div class="d-flex">
					<select v-model="workTime.startAt" id="startTime" class="form-control" required>
						<template v-for="hour in ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']" :key="hour">
							<template v-for="minute in ['00', '10', '20', '30', '40', '50']" :key="minute">
								<option :value="`${ hour }:${ minute }`">{{ hour }}:{{ minute }}</option>
							</template>
						</template>
						<option value="24:00">24:00</option>
					</select>
				</div>
			</div>
			<div class="form-group">
				<label for="endTime">끝시간:</label>
				<div class="d-flex">
					<select v-model="workTime.endAt" id="startTime" class="form-control" required>
						<template v-for="hour in ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']" :key="hour">
							<template v-for="minute in ['00', '10', '20', '30', '40', '50']" :key="minute">
								<option :value="`${ hour }:${ minute }`">{{ hour }}:{{ minute }}</option>
							</template>
						</template>
						<option value="24:00">24:00</option>
					</select>
				</div>
				
			</div>
			<button type="submit" class="btn btn-primary">저장</button>
		</form>
	</div>
</template>

<style scoped>
.form-container {
	width: 100%;
	padding: 20px;
}

.form-group {
	margin-bottom: 15px;
}

.d-flex {
	display: flex;
	gap: 10px;
}

.btn-primary {
	background-color: #007bff;
	border-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
	border-color: #004085;
}
</style>
