import asyncio
import logging
import re
from aiogram import Dispatcher, types
import aiohttp
from token_bot import bot
from aiogram.dispatcher import FSMContext
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, KeyboardButton
from aiogram.types.web_app_info import WebAppInfo
from settings import HOST, APP_URL

logging.basicConfig(level=logging.INFO)
memstore=MemoryStorage()
dp=Dispatcher(bot, storage=memstore)

class Form(StatesGroup):
    access_to_courses=State()
    courses=State()
    MyProfile=State()
    Feedback=State()

@dp.message_handler(commands=['start'], state=None)
async def start(message: types.Message, state: FSMContext):
    print(message.chat.id)
    await message.answer("Создать пользователя",
                         reply_markup=InlineKeyboardMarkup().add(
                             InlineKeyboardButton(text="create", web_app=WebAppInfo(url=f"{APP_URL}/{message.chat.id}"))))
    await Form.MyProfile.set()


async def send_data(chatID: int):
    """Send data to django server"""
    payload = {
		'chatID': chatID		
	}
    print(payload)
    async with aiohttp.ClientSession() as session:
        async with session.post(f'http://{HOST}/user/getUserId', data=payload) as response:
            print("Status:", response.status)
	

@dp.message_handler(state=Form.MyProfile)
async def MyProfile(message: types.Message, state: FSMContext):
    async with state.proxy() as proxy:
        keyboardProfile = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
        button = types.KeyboardButton(text="Мой профиль👤")
        buttonKurs = types.KeyboardButton(text="Курсы📚")
        buttonFeed = types.KeyboardButton(text="Обратная связь📞")
        keyboardProfile.add(button, buttonKurs, buttonFeed)
        await bot.send_message(message.chat.id, "Меню", reply_markup=keyboardProfile)

    if message.text == "Мой профиль👤":
        await message.answer("Мой профиль",
                         reply_markup=InlineKeyboardMarkup().add(
                             InlineKeyboardButton(text="create", web_app=WebAppInfo(url=f"{APP_URL}/{message.chat.id}/course"))))
    elif message.text == "Курсы📚":
        await Form.courses.set()

@dp.message_handler(state=Form.courses)
async def Kurs(message: types.Message, state: FSMContext):
    await message.answer("Test kursov")

@dp.message_handler(text=[''],)
async def feedback(message: types.Message):
    await bot.send_message(message.chat.id, "Введите ваше сообщение")
    keyboardFeedback = types.ReplyKeyboardMarkup(row_width=1, resize_keyboard=True)
    button = types.KeyboardButton(text='Подтвердить ')

async def main():
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())