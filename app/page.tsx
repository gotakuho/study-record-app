"use client";

import { FormEvent, useEffect, useState } from "react";

type StudyRecord = {
  id: number;
  subject: string;
  minutes: number;
  memo: string;
  date: string;
};

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("基本情報");
  const [minutes, setMinutes] = useState("");
  const [memo, setMemo] = useState("");
  const [records, setRecords] = useState<StudyRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 网页打开时，从localStorage读取以前保存的记录
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem("studyRecords");

      if (savedRecords) {
        setRecords(JSON.parse(savedRecords) as StudyRecord[]);
      }
    } catch {
      console.error("保存されたデータを読み込めませんでした。");
    }

    setIsLoaded(true);
  }, []);

  // 记录发生变化时，自动保存到localStorage
  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem("studyRecords", JSON.stringify(records));
  }, [records, isLoaded]);

  // 计算全部学习时间
  const totalMinutes = records.reduce(
    (total, record) => total + record.minutes,
    0
  );

  // 添加学习记录
  function addRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const numberOfMinutes = Number(minutes);

    if (!minutes || numberOfMinutes <= 0) {
      alert("学習時間を正しく入力してください。");
      return;
    }

    const newRecord: StudyRecord = {
      id: Date.now(),
      subject,
      minutes: numberOfMinutes,
      memo,
      date: new Date().toLocaleDateString("ja-JP"),
    };

    setRecords((currentRecords) => [newRecord, ...currentRecords]);

    setSubject("基本情報");
    setMinutes("");
    setMemo("");
    setShowForm(false);
  }

  // 删除学习记录
  function deleteRecord(id: number) {
    const shouldDelete = window.confirm("この記録を削除しますか？");

    if (shouldDelete) {
      setRecords((currentRecords) =>
        currentRecords.filter((record) => record.id !== id)
      );
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* 标题 */}
        <header className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            学習記録アプリ
          </h1>

          <p className="text-gray-600">
            毎日の勉強時間を記録するアプリです。
          </p>
        </header>

        {/* 总学习时间 */}
        <section className="mb-6 rounded-xl bg-white p-6 shadow">
          <p className="text-sm text-gray-500">合計勉強時間</p>

          <p className="mt-2 text-4xl font-bold text-blue-600">
            {totalMinutes}分
          </p>

          <p className="mt-2 text-sm text-gray-500">
            記録件数：{records.length}件
          </p>
        </section>

        {/* 打开表单的按钮 */}
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700"
          >
            学習記録を追加
          </button>
        )}

        {/* 添加记录表单 */}
        {showForm && (
          <form
            onSubmit={addRecord}
            className="mt-6 rounded-xl bg-white p-6 shadow"
          >
            <h2 className="mb-5 text-xl font-bold text-gray-900">
              新しい学習記録
            </h2>

            {/* 科目 */}
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="mb-2 block font-bold text-gray-700"
              >
                科目
              </label>

              <select
                id="subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
              >
                <option value="基本情報">基本情報</option>
                <option value="日本語">日本語</option>
                <option value="Java">Java</option>
                <option value="Web制作">Web制作</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* 学习时间 */}
            <div className="mb-4">
              <label
                htmlFor="minutes"
                className="mb-2 block font-bold text-gray-700"
              >
                学習時間（分）
              </label>

              <input
                id="minutes"
                type="number"
                min="1"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                placeholder="例：60"
                required
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
              />
            </div>

            {/* 备注 */}
            <div className="mb-5">
              <label
                htmlFor="memo"
                className="mb-2 block font-bold text-gray-700"
              >
                メモ
              </label>

              <textarea
                id="memo"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                placeholder="今日勉強した内容"
                rows={4}
                className="w-full rounded-lg border border-gray-300 p-3 text-gray-900"
              />
            </div>

            {/* 保存和取消按钮 */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
              >
                保存
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setMinutes("");
                  setMemo("");
                }}
                className="rounded-lg bg-gray-300 px-5 py-3 font-bold text-gray-800 hover:bg-gray-400"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}

        {/* 学习记录列表 */}
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            学習履歴
          </h2>

          {!isLoaded ? (
            <div className="rounded-xl bg-white p-6 text-gray-500 shadow">
              読み込み中です。
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-gray-500 shadow">
              まだ学習記録がありません。
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((record) => (
                <article
                  key={record.id}
                  className="rounded-xl bg-white p-5 shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {record.subject}
                      </h3>

                      <p className="mt-1 text-2xl font-bold text-blue-600">
                        {record.minutes}分
                      </p>

                      <p className="mt-2 text-sm text-gray-500">
                        {record.date}
                      </p>

                      {record.memo && (
                        <p className="mt-3 whitespace-pre-wrap text-gray-700">
                          {record.memo}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteRecord(record.id)}
                      className="rounded-lg bg-red-100 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                    >
                      削除
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}