<script setup>
import { onMounted, ref, computed } from 'vue'
import db from './firebase/config.js'
import { collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const expenses = ref([])
const expenseName = ref('')
const expenseAmount = ref(0)
const selectedCategory = ref('')
const editingExpense = ref(null)

const categories = ref([
  { id: 'bills', name: 'Bills' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' }, 
  { id: 'food', name: 'Food' },
  { id: 'travel', name: 'Travel' },
])

const getExpenses = async () => {
  onSnapshot(collection(db, 'expenses'), (querySnapshot) => {
    expenses.value = querySnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }))
  })
}

const addExpense = async () => {
  const data = {
    name: expenseName.value,
    amount: expenseAmount.value,
    date: new Date().toISOString(),
    category: selectedCategory.value,
  }
  await addDoc(collection(db, 'expenses'), data)
  expenseName.value = ''
  expenseAmount.value = 0
  selectedCategory.value = ''
}

const deleteExpense = async (id, index) => {
  const confirmDelete = confirm("Are you sure you want to delete this expense with id: " + id + "?")
  if (confirmDelete) {
    await deleteDoc(doc(db, 'expenses', id))
    expenses.value.splice(index, 1)
  }
}

const editExpense = (expense) => {
  editingExpense.value = expense
  expenseName.value = expense.data.name
  expenseAmount.value = expense.data.amount
  selectedCategory.value = expense.data.category
}

const updateExpense = async () => {
  const data = {
    name: expenseName.value,
    amount: expenseAmount.value,
    category: selectedCategory.value,
  }
  await updateDoc(doc(db, 'expenses', editingExpense.value.id), data)
  expenseName.value = ''
  expenseAmount.value = 0
  selectedCategory.value = ''
  editingExpense.value = null
}

const filteredExpenses = computed(() => {
  if (selectedCategory.value === '') {
    return expenses.value
  } else {
    return expenses.value.filter(expense => expense.data.category === selectedCategory.value)
  }
})

const totalExpenses = computed(() => {
  return filteredExpenses.value.reduce((total, expense) => total + parseFloat(expense.data.amount), 0).toFixed(2)
})

onMounted(() => {
  getExpenses()
})
</script>

<template>
  <div class="expense-tracker-container">
    <div class="m-8 min-w-[600px] flex flex-col gap-4">
      <h1 class="text-4xl text-center">Expense Tracker</h1>
      <div class="flex gap-4">
     
        <div class="flex-1">
          <div class="container">
            <label for="expenseName" class="block mb-1">Item:</label>
            <input type="text" id="expenseName" class="border border-gray-300 p-2 rounded w-full" v-model="expenseName" placeholder="Expense Name">
          </div>
          <div class="mt-4">
            <label for="selectedCategory" class="block mb-1">Category:</label>
            <select id="selectedCategory" class="border border-gray-300 p-2 rounded w-full" v-model="selectedCategory">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
          </div>
          <div class="mt-4">
            <label for="expenseAmount" class="block mb-1">Amount:</label>
            <input type="number" id="expenseAmount" class="border border-gray-300 p-2 rounded w-full" v-model="expenseAmount" placeholder="Amount">
          </div>
          <button v-if="!editingExpense" class="bg-green-600 text-white p-3 rounded-full mt-4 w-full" @click="addExpense">Add Expense</button>
          <button v-if="editingExpense" class="bg-red-600 text-white p-3 rounded-full mt-4 w-full" @click="updateExpense">Update Expense</button>
        </div>

        <div class="flex-1">
          <div class="overflow-y-auto border border-gray-300" style="max-height: 70vh;">
            <table class="border-collapse border w-full">
              <thead>
                <tr class="font-bold">
                  <th class="p-2 border bg-gray-300">Item</th>
                  <th class="p-2 border bg-gray-300">Amount</th>
                  <th class="p-2 border bg-gray-300">Date</th>
                  <th class="p-2 border bg-gray-300">Category</th>
                  <th class="p-2 border bg-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(expense, index) in filteredExpenses" :key="expense.id">
                  <td class="p-2 border">{{ expense.data.name }}</td>
                  <td class="p-2 border">{{ expense.data.amount }}</td>
                  <td class="p-2 border">{{ new Date(expense.data.date).toLocaleDateString() }}</td>
                  <td class="p-2 border">{{ expense.data.category }}</td>
                  <td class="p-2 border">
                    <button class="bg-green-500 text-white px-1 rounded mr-2" @click="editExpense(expense)"><i class="fa fa-edit"></i></button>
                    <button class="bg-red-700 text-white px-1 rounded" @click="deleteExpense(expense.id, index)"><i class="fa fa-trash"></i></button>
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
      
          <div class="text-center mt-4">
            <h2 class="text-xl">TOTAL EXPENSES:</h2>
            <p class="text-3xl font-bold text-red-500">₱ {{ totalExpenses }}</p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.expense-tracker-container {
  background-color: #96cf6d;
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  height: auto; 
  width: 700px; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  margin-left: 250px;
}

th, td {
  padding: 10px;
  border: 1px solid #100f0f;
  background-color: #ccc;
}

th {
  background-color: rgb(23, 23, 22);
  color: #cecaca;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

h1 {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}
</style>
