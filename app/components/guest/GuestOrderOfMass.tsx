"use client";

import React from "react";
import { usePlanner } from "../../context/PlannerContext";

export const GuestOrderOfMass: React.FC = () => {
  const { settings } = usePlanner();

  return (
    <section className="py-14 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            Catholic Liturgy of Christian Burial
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif mt-1">
            Order of Funeral Mass
          </h1>
          <p className="text-sm text-slate-300 mt-2">
            In Solemn Memory of <strong>{settings.honoree}</strong> (Aged 74 Years)
          </p>
          <p className="text-xs text-amber-300/90 mt-1">
            {settings.churchVenue} • Celebrant: Rev. Fr. Nicholas Oboh
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors w-fit no-print"
        >
          Print Order of Mass
        </button>
      </div>

      <div className="space-y-12">
        {/* PART 1: INTRODUCTORY RITES */}
        <div className="bg-slate-900/70 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400">PART I</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
              Introductory Rites &amp; Reception of the Body
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              At the Church Entrance • 11:00 AM
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                1. Reception of the Body &amp; Sprinkling with Holy Water
              </h3>
              <p className="text-slate-300">
                The Priest, accompanied by the altar servers, meets the casket at the door of the church. The Priest sprinkles the casket with holy water in remembrance of Baptism:
              </p>
              <p className="italic text-slate-400 border-l-2 border-amber-500/40 pl-3 py-0.5">
                &ldquo;In the waters of baptism, Festus died with Christ and rose with him to new life. May he now share with him eternal glory.&rdquo;
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                2. Placing of Christian Symbols
              </h3>
              <p className="text-slate-300">
                The White Pall (symbolizing baptismal garment), the Holy Bible, and the Crucifix are placed upon the casket by family representatives.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                3. Entrance Procession &amp; Hymn: &ldquo;Abide With Me&rdquo;
              </h3>
              <div className="text-xs text-slate-300 space-y-1.5 italic font-serif">
                <p>1. Abide with me; fast falls the eventide; The darkness deepens; Lord, with me abide;</p>
                <p>When other helpers fail and comforts flee, Help of the helpless, O abide with me.</p>
                <p className="mt-2">2. Swift to its close ebbs out life’s little day; Earth’s joys grow dim, its glories pass away;</p>
                <p>Change and decay in all around I see; O Thou who changest not, abide with me.</p>
                <p className="mt-2">3. Hold Thou Thy cross before my closing eyes; Shine through the gloom and point me to the skies;</p>
                <p>Heaven’s morning breaks, and earth’s vain shadows flee; In life, in death, O Lord, abide with me. Amen.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                4. Opening Prayer (Collect)
              </h3>
              <p className="text-slate-400">
                <strong>Celebrant:</strong> Let us pray. O God, almighty Father, our faith professes that your Son died and rose again; mercifully grant that through this mystery your servant Festus Okoruwa Akhabue, who has fallen asleep in Christ, may rejoice to rise again through him. Who lives and reigns with you in the unity of the Holy Spirit, God, for ever and ever.
              </p>
              <p className="text-amber-300 font-semibold">People: Amen.</p>
            </div>
          </div>
        </div>

        {/* PART 2: LITURGY OF THE WORD */}
        <div className="bg-slate-900/70 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400">PART II</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
              Liturgy of the Word
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Readings from Sacred Scripture
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {/* First Reading */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                  First Reading: Wisdom 3:1–9
                </h3>
                <span className="text-[11px] text-slate-400 italic">Read by Family Representative</span>
              </div>
              <p className="text-slate-300 italic">
                &ldquo;The souls of the virtuous are in the hands of God, no torment shall ever touch them. In the eyes of the foolish they seemed to have died, and their departure was thought to be a disaster, and their going from us to be their destruction; but they are at peace. For though in the sight of others they were punished, their hope is full of immortality... Those who trust in him will understand truth, and the faithful will abide with him in love, because grace and mercy are upon his elect.&rdquo;
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Reader: The Word of the Lord. <strong className="text-amber-300">People: Thanks be to God.</strong>
              </p>
            </div>

            {/* Responsorial Psalm */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Responsorial Psalm: Psalm 23
              </h3>
              <p className="font-semibold text-amber-400 text-xs sm:text-sm">
                Response: The Lord is my shepherd; there is nothing I shall want.
              </p>
              <div className="text-xs text-slate-300 space-y-1 pl-2 border-l border-white/10">
                <p>1. The Lord is my shepherd; I shall not want. In verdant pastures he gives me repose; beside restful waters he leads me; he refreshes my soul. <span className="text-amber-300 font-semibold">[Response]</span></p>
                <p>2. He guides me in right paths for his name’s sake. Even though I walk in the dark valley I fear no evil; for you are at my side with your rod and your staff that give me courage. <span className="text-amber-300 font-semibold">[Response]</span></p>
                <p>3. You spread the table before me in the sight of my foes; you anoint my head with oil; my cup overflows. <span className="text-amber-300 font-semibold">[Response]</span></p>
                <p>4. Only goodness and kindness follow me all the days of my life; and I shall dwell in the house of the Lord for years to come. <span className="text-amber-300 font-semibold">[Response]</span></p>
              </div>
            </div>

            {/* Second Reading */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                  Second Reading: 2 Timothy 4:6–8
                </h3>
                <span className="text-[11px] text-slate-400 italic">Read by Family Representative</span>
              </div>
              <p className="text-slate-300 italic">
                &ldquo;Beloved: As for me, my life is already being poured out like a libation, and the time of my departure is at hand. I have fought the good fight, I have finished the race, I have kept the faith. From now on there is reserved for me the crown of righteousness, which the Lord, the righteous judge, will award to me on that day, and not only to me but also to all who have longed for his appearing.&rdquo;
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Reader: The Word of the Lord. <strong className="text-amber-300">People: Thanks be to God.</strong>
              </p>
            </div>

            {/* Gospel Acclamation & Gospel */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                The Holy Gospel: John 14:1–6
              </h3>
              <p className="text-xs text-amber-400 font-semibold">
                Celebrant: The Lord be with you. People: And with your spirit.
              </p>
              <p className="text-slate-300 italic">
                &ldquo;Jesus said to his disciples: &lsquo;Do not let your hearts be troubled. You have faith in God; have faith also in me. In my Father’s house there are many dwelling places. If there were not, would I have told you that I am going to prepare a place for you? And if I go and prepare a place for you, I will come back again and take you to myself, so that where I am you also may be. Where I am going you know the way.&rsquo; Thomas said to him, &lsquo;Master, we do not know where you are going; how can we know the way?&rsquo; Jesus said to him, &lsquo;I am the way and the truth and the life. No one comes to the Father except through me.&rsquo;&rdquo;
              </p>
              <p className="text-xs text-slate-400 pt-1">
                Celebrant: The Gospel of the Lord. <strong className="text-amber-300">People: Praise to you, Lord Jesus Christ.</strong>
              </p>
            </div>

            {/* Homily & Prayers of Faithful */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Homily &amp; Prayers of the Faithful
              </h3>
              <p className="text-slate-400">
                <strong>Homily:</strong> Delivered by Rev. Fr. Nicholas Oboh, Parish Priest.
              </p>
              <p className="text-slate-400">
                <strong>General Intercessions:</strong> Prayers for our beloved father Festus Okoruwa Akhabue, for the comforting of the bereaved Akhabue family, for the Parish and the faithful departed.
              </p>
            </div>
          </div>
        </div>

        {/* PART 3: LITURGY OF THE EUCHARIST */}
        <div className="bg-slate-900/70 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400">PART III</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
              Liturgy of the Eucharist
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Offertory, Eucharistic Prayer &amp; Holy Communion
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Offertory Procession
              </h3>
              <p className="text-slate-300">
                The Children and Family members lead the presentation of the gifts of Bread, Wine, and Thanksgiving Offerings to the Altar.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Communion Hymn: &ldquo;Soul of My Saviour&rdquo;
              </h3>
              <div className="text-xs text-slate-300 space-y-1 italic font-serif">
                <p>1. Soul of my Saviour, sanctify my breast; Body of Christ, be Thou my saving guest;</p>
                <p>Blood of my Saviour, bathe me in Thy tide, Wash me with water flowing from Thy side.</p>
                <p className="mt-2">2. Strength and protection may Thy passion be; O blessed Jesus, hear and answer me;</p>
                <p>Deep in Thy wounds, Lord, hide and shelter me; So shall I never, never part from Thee.</p>
                <p className="mt-2">3. Guard and defend me from the foe malign; In death’s dread moments make me only Thine;</p>
                <p>Call me and bid me come to Thee on high, Where I may praise Thee with Thy saints for aye. Amen.</p>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                Post-Communion Prayer
              </h3>
              <p className="text-slate-400">
                <strong>Celebrant:</strong> Let us pray. Having received the Sacrament of your Only Begotten Son, who was sacrificed for us and rose in glory, we humbly implore you, O Lord, for your servant Festus, that, cleansed by the paschal mysteries, he may glory in the gift of the resurrection to come. Through Christ our Lord.
              </p>
              <p className="text-amber-300 font-semibold">People: Amen.</p>
            </div>
          </div>
        </div>

        {/* PART 4: FINAL COMMENDATION & FAREWELL */}
        <div className="bg-slate-900/70 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="border-b border-white/10 pb-3">
            <span className="text-xs font-mono font-bold text-amber-400">PART IV</span>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mt-0.5">
              Rite of Final Commendation &amp; Farewell
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Valediction, Incensation &amp; Recessional
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                1. Brief Family Acknowledgments
              </h3>
              <p className="text-slate-300">
                Words of appreciation by the Akhabue children to the Church, Parish Priest, clergy, choir, and all attending dignitaries and well-wishers.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                2. Song of Farewell
              </h3>
              <p className="italic text-slate-300 font-serif">
                &ldquo;May the angels lead you into paradise; may the martyrs come to welcome you and take you to the holy city, the new and eternal Jerusalem. May choirs of angels welcome you and where Lazarus is poor no longer, may you have eternal rest.&rdquo;
              </p>
              <p className="text-xs text-slate-400 mt-2">
                The Priest incenses and sprinkles the casket with holy water during the song.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                3. Prayer of Commendation
              </h3>
              <p className="text-slate-400">
                <strong>Celebrant:</strong> Into your hands, Father of mercies, we commend our brother Festus Okoruwa Akhabue, in the sure and certain hope that, together with all who have died in Christ, he will rise with him on the last day. We give you thanks for the blessings which you bestowed upon him in this life: they are signs to us of your goodness and of our fellowship with the saints in Christ. Merciful Lord, turn toward us and listen to our prayers, open the gates of paradise to your servant and help us who remain to comfort one another with assurances of faith, until we all meet in Christ and are with you and with our brother forever.
              </p>
              <p className="text-amber-300 font-semibold">People: Amen.</p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-white/5 space-y-2">
              <h3 className="text-amber-300 font-semibold text-xs uppercase tracking-wider">
                4. Recessional Hymn: &ldquo;Nearer, My God, to Thee&rdquo;
              </h3>
              <div className="text-xs text-slate-300 space-y-1.5 italic font-serif">
                <p>1. Nearer, my God, to Thee, nearer to Thee! E’en though it be a cross that raiseth me,</p>
                <p>Still all my song shall be, nearer, my God, to Thee; Nearer, my God, to Thee, nearer to Thee!</p>
                <p className="mt-2">2. Though like the wanderer, the sun gone down, Darkness be over me, my rest a stone;</p>
                <p>Yet in my dreams I’d be nearer, my God, to Thee; Nearer, my God, to Thee, nearer to Thee!</p>
                <p className="mt-2">3. Or if on joyful wing cleaving the sky, Sun, moon, and stars forgot, upwards I fly,</p>
                <p>Still all my song shall be, nearer, my God, to Thee; Nearer, my God, to Thee, nearer to Thee! Amen.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
              <p className="font-semibold">Procession to Akhabue Compound:</p>
              <p className="text-slate-300 mt-0.5">
                Following the final blessing, the casket is conveyed to the Akhabue Family Compound, Eidenu, Irrua for the solemn Catholic Rite of Committal and Interment, followed by the funeral reception.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
